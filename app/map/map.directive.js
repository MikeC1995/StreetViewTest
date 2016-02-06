'use strict';

var app = angular.module('app');
app.directive('map', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id'
      },
      link: function(scope, elem, attrs) {
        // Loads google map script
        loadGoogleMapAPI.then(function () {
            // Promised resolved
            scope.initialize();
        }, function () {
            // Promise rejected
            console.error("Couldn't load Google Maps API!");
        });

        scope.initialize = function() {
          var myLatLng = {lat: -25.363, lng: 131.044};

          var map = new google.maps.Map(document.getElementById(scope.mapId), {
            zoom: 4,
            center: myLatLng
          });

          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!'
          });
        }
      }
  };
}]);
