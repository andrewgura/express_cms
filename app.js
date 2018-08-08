var express = require("express");
var exphbs = require("express-handlebars");
var sass = require("node-sass");
var path = require("path");
var keystone = require("keystone");
require('dotenv').config();

var app = express();

//View Engine: HandleBars
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "index" }));
app.set("view engine", "handlebars");

//Use Sass
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: true,
    sourceMap: true
  })
);

//Point to where public files are for app to use
app.use(express.static(path.join(__dirname, "public")));

keystone.init({
  name: "Website Name",
  brand: "Website Brand",
  session: false,
  updates: "updates",
  auth: true,
  'cloudinary config': process.env.CLOUDINARY_URL,
  "user model": "User",
  "auto update": true,
  "cookie secret": "aaa"
});

//use routes from another file to organize code better
var routes = require("./routes/index");
app.use(routes);


keystone.import("models");
keystone.set("routes", app);
keystone.start();
