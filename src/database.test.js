const sqlite3 = require('sqlite3').verbose();//import sqlite3

let db;//create a variable to hold the database

//before each test create a new database in memory and create a table named users with the columns id, username and password
beforeEach(() => {
  db = new sqlite3.Database(':memory:');
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
});

//after each test close the database connection to avoid memory leaks 
//and other issues that may arise from having too many open connections to the database file in memory
afterEach(() => {
  db.close();
});

//test to insert and retrieve a user from the database 
test('inserts and retrieves a user', (done) => {
  //insert a user into the database and retrieve the user from the database to check if the user was inserted correctly
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', 'testpassword'], function(err) {
    if (err) {
      return done(err);
    }
    //retrieve the user from the database and check if the user was inserted correctly by checking the 
    //username and password of the user 
    db.get(`SELECT * FROM users WHERE id = ?`, [this.lastID], (err, row) => {
      if (err) {
        return done(err);
      }
      expect(row.username).toBe('testuser');
      expect(row.password).toBe('testpassword');
      done();
    });
  });
});