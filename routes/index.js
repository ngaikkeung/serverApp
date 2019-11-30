const express = require('express');
const app = express();
const session = require('cookie-session');
const DB = new (require('../db.js'))();

app.use(session({
    name: "session",
    secret: "loginInfo"
}))

app.get('/', (req, res) => {
    if(req.session.authenticated){
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
    }else{
        res.render('login');
    }
})

module.exports = app;