const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const hbs = require("hbs");
const path = require("path");
const authRoutes = require("./routes/authroutes");
const cookieParser = require ("cookie-parser");
const app = express();


//Set view engine and register partials
app.set ('view engine', 'hbs');
app.set ('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');


//Database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => console.log("Connected to database"))
.catch((err) => console.log(err))

//mongoose.set ('strictQuery', false);

//Middleware
app.use(morgan("dev"));
app.use(express.static("./public"))
app.use(authRoutes);
app.use(express.json());
app.use(cookieParser);

/**
app.use((req, res, next) => {
  console.log("New request made;");
  console.log("Host: ", req.hostname);
  console.log("Path: ", req.path);
  console.log("Method: ", req.method);
  
  next();
})
*/

//app.get('*', checkUser);

app.listen(3000, ()=> {
  console.log("App listening on port 3000");
});
