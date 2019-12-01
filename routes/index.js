const express = require('express');
const app = express();
const session = require('cookie-session');
const DB = new (require('../db.js'))();

const sessionChecker = (req, res, next) => {
    if (!req.session.authenticated) {
        res.render('login');
    } else {
        next();
    }    
};

app.use(session({
    name: "session",
    secret: "loginInfo",
    maxAge: 60 * 1000 // 1 minutes to expire
}))

app.get('/', sessionChecker, (req, res) => {
    DB.getRestaurantList((err, response) => {
        if(err){
            console.log("ERR!", err);
        }else{
            if(response){
                console.log("Show success");
                res.render('home', {userid: req.session.userid, restaurantList: response});
            }else{
                console.log("Show failed", response);
            }
        }
    })
})



module.exports = app;