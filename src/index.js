const OpenAI = require("openai");  //import openai
const express = require('express'); //import express
const bodyParser = require('body-parser'); //import body-parser
const cors = require('cors');  //import cors

const app = express(); //create an express app
const port = 3000; //create a port
const sqlite3 = require('sqlite3').verbose(); //import sqlite3

//middelwares
app.use(cors());    //use cors
app.use(bodyParser.json()); //use body-parser
app.use(bodyParser.json()); //use body-parser


require('dotenv').config();//import the dotenv package to use the .env file

//new instance of openai with the api key from the .env file
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Connect to the database file and create a new database if it doesn't exist
let db = new sqlite3.Database('./chatbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chatbot database.');
});

// Create a new table named conversation if it doesn't exist in the database file
db.run(`CREATE TABLE IF NOT EXISTS conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    bot_response TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

//function to save the message to the database with the user message and the bot response as parameters
function saveMessage(userMessage, botResponse) {
    db.run(`INSERT INTO conversation(user_message, bot_response) VALUES(?,?)`, [userMessage, botResponse], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

//function to get all the messages from the database and return them as a json object
app.use(bodyParser.urlencoded({ extended: false }));

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

//function to save the message to the database with the user message and the bot response as parameters
app.post('/submit-your-login-form', (req, res) => {
    let sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    /* get the user from the database with the username and password from the request body as parameters 
    and check if the user exists in the database or not and redirect to the home page if the user exists or 
    send an error message if the user doesn't exist in the database */
    db.get(sql, [req.body.username, req.body.password], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            res.redirect('/home.html');
        } else {
            res.send('Invalid username or password');
        }
    });
});

//function to get all the messages from the database and return them as a json object
app.post('/submit-your-registration-form', (req, res) => {
    let sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
    /* insert the new user to the database with the username and password from the request body 
    as parameters and redirect to the home page */
    db.run(sql, [req.body.username, req.body.password], (err) => {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/home.html');
    });
  });

//function to get all the messages from the database and return them as a json object
app.listen(5050, () => {
    console.log('Server started on port 3000');
});


//Assincronic function to start the server 
async function main() {

    app.use(express.static('views'));//use the views folder
    app.use(express.json());//use json

    //start the server on the port 3000 and print a message in the console when the server is running
    app.listen(port, () => { 
        console.log(`Server is running on port http://localhost:${port}`)
    })

    let history = [];//create an empty array to store the chat history

    //get all the messages from the database and return them as a json object
    app.post('/api/chat', async (req, res) => {
        if (!req.body || !req.body.userQuestion) {
            return res.status(400).json({ error: "Bad Request or missing request" });
        }

        let userQuestion = req.body.userQuestion;//get the user question from the request body

        let messages = [{ role: "user", content: userQuestion }];//create an array of messages with the user question

        //try to get the bot response from the openai api and save the user message and the bot response to the database
        try {
            //get the bot response from the openai api with the user question as a parameter
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages
            });

            let userMessage = messages[0].content;
            let botResponse = completion.choices[0].message.content;
            saveMessage(userMessage, botResponse);

            history.push(messages[0]);//push the user message to the chat history
            history.push({ role: "bot", content: botResponse });//push the bot response to the chat history

            //return the bot response as a json object
            res.json({
                botResponse: botResponse
            });

        } catch (error) {
            console.error("Error from openai api", error);
        }
    });


}

main() //start the server