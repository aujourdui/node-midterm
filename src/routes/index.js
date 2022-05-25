const router = require("express").Router();
const db = require("../services/dbsqlite");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.status(200).json({ msg: "test" });
});

router.get("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.error(err);
    }
    res.redirect("/api/login");
  });
});

router.get("/api/login", (req, res) => {
  let sess = req.session;
  console.log(sess);

  if (sess.email) {
    return res.redirect("/api/home");
  }
  res.render("login");
});

router.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM Users where Email="${email}"`;

  db.get(sql, [], async (err, row) => {
    const compared = await bcrypt.compare(password, row.Password);

    if (err) return console.error(err.message);

    if (compared) {
      req.session.email = email;
      res.redirect("/api/home");
      res.end();
    } else {
      res.end("Invalid credentials");
    }
  });
});

router.get("/api/register", (req, res) => {
  let sess = req.session;
  if (sess.email) {
    return res.redirect("/api/home");
  }
  res.render("register");
});

router.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  let hashedPassword = await bcrypt.hash(password, 10);
  const sql = `INSERT INTO Users (Email, Password) VALUES ("${email}","${hashedPassword}")`;
  const sqlCompare = `SELECT Email from Users`;

  db.get(sqlCompare, [], (err, row) => {
    if (err) return console.error(err.message);
    // console.log(email);
    // console.log(row.Email);

    // res.end();
    if (row !== undefined && email === row.Email) {
      // if (email === row.Email) {
      res.write(`
        <h1>Duplicate User, please change your email</h1>
        Please register again <a href="/api/register">here</a>.`);
      // res.write(`
      //   <h3>Duplicate User, please change your email<h3>
      //   Please register again <a href="/api/register">here</a>`);
      res.end();
      // }
    } else {
      db.run(sql, [], (err) => {
        if (err) return console.error(err.message);
        res.write(`
        <h1>You are successfully registered ${email}</h1>
        Please login <a href="/api/login">here</a>.`);
        res.end();
      });
    }
  });
});

router.get("/api/home", (req, res) => {
  const sql = "SELECT * FROM Blog ORDER BY Title";
  const { email } = req.session;

  if (email) {
    db.all(sql, [], (err, rows) => {
      if (err) return console.error(err.message);

      res.render("index", { model: rows });
    });
  } else {
    res.end("Login first");
  }
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
