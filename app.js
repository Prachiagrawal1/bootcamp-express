var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose');
var Task = require("./models/Task");
mongoose.connect('mongodb://localhost/test');
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Hiyya, we are connected!");
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'SomeRandomSecretKey' }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/tasks/add', function (req, res, next) {
  res.render('todo');
});
app.post('/tasks/add', function (req, res, next) {
  var title = req.body.title;
  var des = req.body.des;
  var enddate = req.body.enddate;
  const taskData = new Task({
    title: title,
    description: des,
    endDate: enddate
  });
  taskData.save(function (err) {
    if (err) return handleError(err);
    console.log("Model Saved");
  });
  res.redirect("/tasks/show");
});

app.post('/edit/:id', function () {
  // Task.findByIdAndUpdate(req.params.id, { title:})
});
app.get('/tasks/show', function (req, res) {
  Task.find({}, function (err, tasks) {
    res.render("show", { tasklist: tasks });
  });
});





app.get('/tasks/edit/:id', function (req, res, next) {
  res.render('todo');

});
app.post('/tasks/edit/:id', function (req, res, next) {
  res.render('todo');

});
app.get('/tasks/approve/:id', function (req, res, next) {
  res.render('todo');

});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
