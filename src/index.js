//A01641976 
const OpenAI = require("openai");  //importo la libreria de openai

const express = require('express'); //importo express
const bodyParser = require('body-parser'); //importo body-parser
const cors = require('cors');  //importo cors

const app = express(); //creo la app
const port = 3000; //creo el puerto
const sqlite3 = require('sqlite3').verbose(); //importo sqlite3

//middelwares
app.use(cors());    //uso cors
app.use(bodyParser.json()); //uso body-parser
app.use(bodyParser.json()); //uso body-parser


require('dotenv').config();
//esto es para que se pueda leer el archivo .env

//nueva conexion con open ai y lo voy a igualar a un objeto
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Crear una nueva base de datos si no existe
let db = new sqlite3.Database('./chatbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chatbot database.');
});

// Crear una tabla para guardar los datos de la conversación
db.run(`CREATE TABLE IF NOT EXISTS conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    bot_response TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Función para guardar un mensaje en la base de datos
function saveMessage(userMessage, botResponse) {
    db.run(`INSERT INTO conversation(user_message, bot_response) VALUES(?,?)`, [userMessage, botResponse], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

//función asincrona 
async function main() {

    app.use(express.static('views'));
    app.use(express.json());

    app.listen(port, () => { //escucho el puerto
        console.log(`Server is running on port http://localhost:${port}`) //imprimo en consola
    })

    let history = []; //creo un arreglo vacio

    app.post('/api/chat', async (req, res) => {
        if (!req.body || !req.body.userQuestion) {
            return res.status(400).json({ error: "Bad Request or missing request" });
        }

        let userQuestion = req.body.userQuestion;

        let messages = [{ role: "user", content: userQuestion }];

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages
            });

            let userMessage = messages[0].content;
            let botResponse = completion.choices[0].message.content;
            saveMessage(userMessage, botResponse);

            history.push(messages[0]);
            history.push({ role: "bot", content: botResponse });

            res.json({
                botResponse: botResponse
            });

        } catch (error) {
            console.error("Error from openai api", error);
        }
    });


}

main() //llamo a la función main


