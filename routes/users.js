const express = require('express');
const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoDBuri = 'mongodb+srv://tester1:test1@kc2019-db7fy.azure.mongodb.net/test?retryWrites=true&w=majority';
const app = express();
const projectDB = "projectDB";

app.post('/login', (req, res) => 
    res.render('Login')
)

app.get('/register', (req, res) =>
    res.render('register')
)

app.post('/register', (req, res) => {
    let uname = req.body.username;
    let pw = req.body.password;
    let pw2 = req.body.password2;

    if(pw != pw2){
        console.error({msg: 'Password do not match'});        
    }

    MongoClient.connect(mongoDBuri, function(err, db) {
        if(err){
            consolelog("DB connect error: ", err);
            return;
        }
        console.log("DB connect success!");
        const db_use = db.db(projectDB);
        db_use.collection("userAccount").insertOne({uname, pw}, function(err, res) {
            if(err){
                console.log("DB CURD failed: ", err);
                return;
            }
            console.log('Item inserted');
            db.close();
        });
      });
    res.redirect('/');
})

module.exports = app;