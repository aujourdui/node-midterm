const sqlite3 = require("sqlite3");
const path = require("path");

const db_name = path.join(__dirname, "..", "data", "blog.db");
const db = new sqlite3.Database(db_name, (err) => {
  if (err) return console.error(err.message);
  console.log("Successfully connected to the database");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Blog (
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    Title VARCHAR(100) NOT NULL, 
    Content VARCHAR(255) NOT NULL
);`;

db.run(sql_create, (err) => {
  if (err) return console.error(err.message);

  const sql_insert = `INSERT INTO Blog (ID, Title, Content) VALUES
    (1, 'How to use ejs', 'Basically, ejs in one on the template engine in JS. We can embed and display HTML inside ejs(such as Laravel or Django)'),
    (2, 'How to use sqlite', 'Sqlite is one of the relational database which is lightweight, easy to use. I will share my knowledge about sqlite in this article')`;

  db.run(sql_insert, (err) => {
    if (err) return console.error(err.message);

    console.log("Successfully created Blog table");
  });
});

module.exports = db;