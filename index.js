const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const mongoose = require('mongoose')
// used for session cookie
const session = require('express-session');
const passport = require('passport')
const passportLocal = require('./config/passport-local-strategy');
const MongoStore= require('connect-mongo')(session);
const sassMiddleware= require('node-sass-middleware')
const flash= require('connect-flash');
const customMware=require('./config/middleware');


app.use(sassMiddleware({
    src:'./asset/scss',
    dest:'./asset/css',
    debug:true,
    outputStyle: 'extended',
    prefix:  '/css'  // Where prefix="css" is at <link rel="stylesheets" href="css/style.css"/>
}))
app.use(express.urlencoded());
app.use(cookieParser());




app.use(express.static('./asset'))
app.use(expressLayouts);


// extract style
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//set my views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//mongo store is used to store the session cookie in db
app.use(session({
    name: 'codial',
    //todo: change the scret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        MaxAge: (1000 * 60 * 100)
    },
    store:new MongoStore(
        {
            mongooseConnection:db,
            autoRemove:'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(customMware.setflash);
app.use(passport.setAuthenticatedUser)
// use express router
app.use('/', require('./routes'));




app.listen(port, function (err) {
    if (err) {
        console.log(`there is an error in firing server ${err}`);
    } else {
        console.log(`Successfully started the server on port ${port}`);
    }
})