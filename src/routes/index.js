const router = require("express").Router();
const db = require("../services/dbsqlite");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Todos ORDER BY Title";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    res.render("index", { model: rows });
  });
});

router.get("/create", (req, res) => {
  res.render("create", { model: {} });
});
router.post("/create", (req, res) => {
  const sql = "INSERT INTO Todos (Title) VALUES (?)";
  const todo = [req.body.Title];

  db.run(sql, todo, (err) => {
    if (err) return console.error(err.message);

    res.redirect("/");
  });
});
router.get("/edit", (req, res) => {
  const id = req.query.id;
  const sql = "select * from Todos where id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    res.render("edit", { model: row });
  });
});
router.post("/edit", (req, res) => {
  const sql = "update Todos set Title = ? where id = ?";
  const todo = [req.body.Title];
  const id = req.body.id;
  console.log(id);

  db.run(sql, [todo, id]);
  res.redirect("/");
});
router.get("/delete", (req, res) => {
  const id = req.query.id;
  const sql = "select * from Todos where id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    res.render("delete", { model: row });
  });
});
router.post("/delete", (req, res) => {
  const id = req.body.id;
  const sql = "delete from Todos where id = ?";
  db.run(sql, id);
  res.redirect("/");
});

module.exports = router;
