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
  
});
console.log('hello')
