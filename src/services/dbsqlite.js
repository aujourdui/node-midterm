const sqlite3 = require("sqlite3");
const path = require("path");

const db_name = path.join(__dirname, "..", "tmp", "blog.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) return console.error(err.message);
  console.log("Successfully connected to the database");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Blog (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(100) NOT NULL,
    Content VARCHAR(255) NOT NULL,
    Like INTEGER
);`;

const sql_create_user = `CREATE TABLE IF NOT EXISTS Users (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Email VARCHAR(100) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  UNIQUE(Email)
);`;

const sql_create_comment = `CREATE TABLE IF NOT EXISTS Comments (
  ID INTEGER PRIMARY KEY AUTOINCREMENT,
  Blog_ID INTEGER NOT NULL,
  Comment VARCHAR(255) NOT NULL,
  FOREIGN KEY (Blog_ID) REFERENCES Blog (ID)
);`;

db.run(sql_create, (err) => {
  if (err) return console.error(err.message);

  const sql_insert = `INSERT INTO Blog (ID, Title, Content, Like) VALUES
    (1, 'How to use ejs', 'Basically, ejs in one on the template engine in JS. We can embed and display HTML inside ejs such as Laravel or Django', 0),
    (2, 'How to use sqlite', 'Sqlite is one of the relational database which is lightweight, easy to use. I will share my knowledge about sqlite in this article', 0)`;

  db.run(sql_insert, (err) => {
    if (err) return console.error(err.message);

    console.log("Successfully created Blog table");
  });
});

db.run(sql_create_user, (err) => {
  if (err) return console.error(err.message);
});

db.run(sql_create_comment, (err) => {
  if (err) return console.error(err.message);
});

module.exports = db;
