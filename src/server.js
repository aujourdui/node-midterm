require("./services/dbsqlite");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const ses_opt = {
  secret: "my secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
};

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(ses_opt));

app.use("/", require("./routes"));

app.listen(process.env.PORT || 8000, () =>
  console.log("Server has started...")
);
