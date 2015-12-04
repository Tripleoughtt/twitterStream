
'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http')
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/scaffold');
app.set('views', 'templates')
app.set('view engine', 'jade');


//SOCKETS
var messages = [];
io.on('connection', function(socket){
  console.log('socket connected')
  socket.emit('message', {messages: messages})
  socket.on('sending', function(data){
    messages.push(data.messageText)
    console.log(messages)
    io.emit('messageRecieved', data)
  });
});

// GENERAL MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());
app.use(express.static('public'));

// ROUTES
app.use('/', function(req, res){
  res.render('index')
});

// 404 HANDLER
app.use(function(req, res){
  res.status(404).render('404')
})

server.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});







