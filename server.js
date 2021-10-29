const express = require('express')
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var app = express()
// const MongoClient = require('mongodb').MongoClient
// const ObjectID = require('mongodb').ObjectID
const mongodb = require('mongodb')
const nunYa = require('./app/secrets.js')

var db, collection;

mongoose.connect(nunYa.url, (err, database) => {
    if (err) return console.log(err)
    db = database
    require('./app/routes.js')(app, passport, db, mongodb);
  });



app.listen(2001, () => {
    // mongodb.MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    //     if(error) {
    //         throw error;
    //     }
    //     db = client.db(dbName);
    //     require('./app/routes.js')(app, passport, db);
    //     console.log("Connected to `" + dbName + "`!");
    // });
});  

require('./config/passport')(passport);

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)



// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
