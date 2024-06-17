const OpenAI = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('mi secreto'));
app.use(session({
    secret: 'mi secreto',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('dotenv').config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

let dbR = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the users database.');
});

dbR.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Created users table.');
});

passport.use('signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, username, password, done) => {
    console.log('Signup strategy triggered');
    dbR.get('SELECT * FROM users WHERE username = ?', [username], async function (err, row) {
        if (err) { 
            console.error('Error querying database for signup:', err);
            return done(err); 
        }
        if (row) { 
            console.log('User already exists during signup');
            return done(null, false); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        dbR.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
            if (err) { 
                console.error('Error inserting user into database during signup:', err);
                return done(err); 
            }
            console.log("User created during signup");

            dbR.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
                if (err) { 
                    console.error('Error querying database for newly created user:', err);
                    return done(err); 
                }
                return done(null, row);
            });
        });
    });
}));

app.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/login',
}));

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
}, async (username, password, done) => {
    console.log('Login strategy triggered');
    dbR.get('SELECT * FROM users WHERE username = ?', [username], async function (err, row) {
        if (err) { 
            console.error('Error querying database for login:', err);
            return done(err); 
        }

        if (!row) { 
            console.log('User not found during login');
            return done(null, false); 
        }

        const isPasswordValid = await bcrypt.compare(password, row.password);
        if (!isPasswordValid) { 
            console.log('Invalid password during login');
            return done(null, false); 
        }

        console.log('User authenticated successfully');
        return done(null, row);
    });
}));

app.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login',
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    dbR.get('SELECT * FROM users WHERE id = ?', [id], function (err, row) {
        if (err) { 
            console.error('Error querying database for deserialization:', err);
            return done(err); 
        }
        done(null, row);
    });
});


app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}, (req, res) => {
    res.redirect("/home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/home", (req, res) => {
    if (!req.isAuthenticated()) {
        console.log('User not authenticated for /home');
        return res.redirect('/login');
    }
    res.render("home");
});

let db = new sqlite3.Database('./chatbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the chatbot database.');
});

function clearDatabase() {
    db.run(`DELETE FROM conversation`, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`All rows have been deleted from the conversation table`);
    });
    db.run(`UPDATE SQLITE_SEQUENCE SET seq = 0 WHERE name = 'conversation'`, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`The ID counter has been reset`);
    });
}

db.run(`CREATE TABLE IF NOT EXISTS conversation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_message TEXT,
    bot_response TEXT
)`, (err) => {
    if (err) {
        console.error(err.message);
    }
});

function saveMessage(userMessage, botResponse) {
    db.run(`INSERT INTO conversation(user_message, bot_response) VALUES(?,?)`, [userMessage, botResponse], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

async function main() {
    clearDatabase();

    app.use(express.static('views'));
    app.use(express.json());

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

            res.json({
                botResponse: botResponse
            });

        } catch (error) {
            console.error("Error from openai api", error);
        }
    });
}

app.listen(port, () => console.log(`Server started on http://localhost:${port}/login`));

main();
