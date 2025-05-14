var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./config/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var leadsRouter = require('./routes/leads');

var app = express();
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/leads', leadsRouter);

app.listen(8001, () => {
  console.log(`Server is running on http://localhost:8001`);
});

module.exports = app;
