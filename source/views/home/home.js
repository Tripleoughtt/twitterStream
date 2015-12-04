'use strict';

angular.module('appFrame')
.factory('socket', function(socketFactory){
  var socket = io()
  return socketFactory({
    ioSocket: socket
  });
})
.controller('homeCtrl', function($scope, socket){
  console.log('homeCtrl');
  //var socket = io();
  socket.on('message', function(data) {
    console.log(data.messages)
    $scope.messages = data.messages
    
  })
  $scope.messages = [];
  $scope.$watchCollection('messages', function(newMessages, oldMessages){
    $scope.messages = newMessages
  })
  socket.on('messageRecieved', function(message){
    $scope.messages.push(message.messageText)
      console.log($scope.messages)
  })

  $scope.sendMessage = function(message){
    console.log(message)
    socket.emit('sending', {messageText: message})
  }
});
console.log('hello')
