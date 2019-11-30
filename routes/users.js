const express = require('express');
const app = express();
const DB = new (require('../db.js'))();
const session = require('cookie-session');

app.get('/register', (req, res) =>
    res.render('register')
)

app.get('/login', (req, res) =>
    res.render('login')
)

app.post('/login', (req, res) => {
    DB.login(req.body.username, req.body.password, (err, response) => {
        if(err){
            console.log("ERR!", err);
        }else{
            if(response){
                console.log("Login success");
                req.session.authenticated = true;
                req.session.userid = req.body.username;
            }else{
                console.log("Login failed");
            }
        }
        res.redirect('/');
    })
    
})

app.post('/register', (req, res) => {
    let uname = req.body.username.trim();
    let pw = req.body.password;
    let pw2 = req.body.password2;

    if(uname == "" || pw !== pw2){
        console.log("Form data error!")
    }else{
        DB.register(uname, pw, (err, response) => {
            if(err){
                console.log("ERR!", err);
            }else{
                if(response){
                    console.log("Register success!");
                }else{
                    console.log("Register failed");
                }
            }
        })
    }
    res.redirect('/');
})

app.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/')
})

module.exports = app;
