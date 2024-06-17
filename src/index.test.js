const request = require('supertest');
const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Set up Express app
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
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

let dbR = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the in-memory users database.');
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

describe('GET /login', () => {
    it('should render the login page', async () => {
        const res = await request(app).get('/login');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('<title>Login</title>');
    });
});

describe('GET /home', () => {
    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash('testpass', 10);
        dbR.run('INSERT INTO users (username, password) VALUES (?, ?)', ['testuser', hashedPassword]);
    });

    it('should render the home page if authenticated', async () => {
        const agent = request.agent(app);

        await agent
            .post('/login')
            .send({ username: 'testuser', password: 'testpass' })
            .expect('Location', '/home');

        const res = await agent.get('/home');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('<title>Home</title>');
    });

    it('should redirect to /login if not authenticated', async () => {
        const res = await request(app).get('/home');
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toBe('/login');
    });
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});

app.listen(port, () => console.log(`Server started on http://localhost:${port}/login`));
