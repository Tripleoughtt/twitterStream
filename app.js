
'use strict';

var PORT = process.env.PORT || 3000;

var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var Twitter = require('twitter');
var functions = require('./modules/functions.js')

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/twitterData');
app.set('views', 'templates');
app.set('view engine', 'jade');

// TWITTER CREDS
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


//SOCKETS
var messages = [];
io.on('connection', function(socket){
  console.log('socket connected')
    socket.emit('message', {messages: messages})
    socket.on('streamBox', function(data){
      var newData = data.map(function(input){
        return input.toFixed(2)
      });
      var location = newData.join(',')
        console.log(location)

        client.stream('statuses/filter', {locations: location}, function(stream) {
          console.log('stream started');
          stream.on('data', function(tweet) {
            console.log(tweet.text, tweet.user.screen_name)
            socket.emit('tweetComing', {name: tweet.user.screen_name, tweet: tweet.text})
            //console.log(tweet.text);
          });

          stream.on('error', function(error) {
            console.log(error);
          });
        });

    });
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
});



server.listen(PORT, function(){
  console.log('Listening on port ', PORT);
});







