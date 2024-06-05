const sqlite3 = require('sqlite3').verbose();

let db;

beforeEach(() => {
  db = new sqlite3.Database(':memory:');
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);
});

afterEach(() => {
  db.close();
});

test('inserts and retrieves a user', (done) => {
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', 'testpassword'], function(err) {
    if (err) {
      return done(err);
    }
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