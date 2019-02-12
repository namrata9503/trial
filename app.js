var createError = require('http-errors');
var express = require('express');
var path = require('path');
// const cors = require('cors');
// const jwt = require('_helpers/jwt');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')

const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// app.use(cors());

// use JWT auth to secure the api
// app.use(jwt());

// api routes

mongoose.connect('mongodb+srv://namrata:Swapnac123@cluster0-jvvsr.mongodb.net/auth-starter?retryWrites=true')
mongoose.connection.on('error', (error) => console.error(error))
mongoose.connection.on('open', () => console.log('successfully connected with mongodb..'))



const userController = require('./controllers/user');

app.post('/api/v1/users', userController.postNewUser);
app.get('/api/v1/users', userController.getAllUsers);
app.get('/api/v1/users/:id', userController.getUserById);
app.put('/api/v1/users/:id', userController.updateUserById);
app.delete('/api/v1/users/:id', userController.deleteUserById);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.get('/', (request, response) => {
  response.send("Hello World........");
})

app.listen(4545, () => console.log('Express server at 4545'))
module.exports = app;
