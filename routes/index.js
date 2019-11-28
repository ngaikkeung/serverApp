const express = require('express');
const assert = require('assert');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoDBuri = 'mongodb+srv://tester1:test1@kc2019-db7fy.azure.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'user';
const app = express();

app.get('/', (req, res) => 
    res.render('login')
)

app.get('/home', (req, res) =>
    res.render('home')
)

module.exports = app;