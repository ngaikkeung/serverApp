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
    res.render('err_page', {errTitle: "404 Not found.", errMsg: "URL path not found."})
});


app.listen(process.env.PORT || 8099);