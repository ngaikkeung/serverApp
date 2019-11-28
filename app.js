const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoDBuri = 'mongodb+srv://tester1:test1@kc2019-db7fy.azure.mongodb.net/test?retryWrites=true&w=majority'
const dbName = 'user';

const app = express();

app.set('view engine', 'ejs');

// parse incoming data to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routing
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(process.env.PORT || 8099);