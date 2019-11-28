const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const app = express();

// parse incoming data to JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));


app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/restaurant', require('./routes/restaurant'));

app.use(function(req, res){
    res.sendStatus(404);
});


app.listen(process.env.PORT || 8099);