
angular.module('appFrame')
.controller('mapCtrl', function($scope, socket){
	console.log('mapCtrl');
	//var socket = io();
	function getLoc() {
		navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
      console.log(lat, long)
			var twitterBox = [long - .4, lat- .4, long + .4, lat + .4]
      socket.emit('streamBox', twitterBox)
      console.log(twitterBox)
          console.log('initializing map')
					initMap(position.coords.latitude, position.coords.longitude);
		});
	}	
  $scope.tweets = [];
  socket.on('tweetComing', function(data){
    $scope.tweets.push(data);
  }) 
	function initMap(x,y){
	  $scope.map = new google.maps.Map(document.getElementById('map'),
		  {
				center: {lat: x, lng: y},
				zoom: 8
			});
    console.log($scope.map)
  }
  getLoc();

});

