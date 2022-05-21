const router = require("express").Router();
const db = require("../services/dbsqlite");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Blog ORDER BY Title";
  db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    res.render("index", { model: rows });
  });
});

router.get("/create", (req, res) => {
  res.render("create", { model: {} });
});
router.post("/create", (req, res) => {
  const sql = "INSERT INTO Blog (Title, Content) VALUES (?, ?)";
  const blog = [req.body.Title, req.body.Content];

  db.run(sql, blog, (err) => {
    if (err) return console.error(err.message);

    res.redirect("/");
  });
});
router.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select * from Blog where id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    res.render("edit", { model: row });
  });
});
router.post("/edit", (req, res) => {
  const sql = `
  update Blog
  set Title = ?,
  Content = ?
  where id = ?`;
  // const blog = [req.body.Title, req.body.Content];
  const title = [req.body.Title];
  const content = [req.body.Content];
  const id = [req.body.id];
  console.log(id);

  db.run(sql, [title, content, id]);
  res.redirect("/");
});
router.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "select * from Blog where id = ?";
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    res.render("delete", { model: row });
  });
});
router.post("/delete", (req, res) => {
  const id = req.body.id;
  const sql = "delete from Blog where id = ?";
  db.run(sql, id);
  res.redirect("/");
});

module.exports = router;
