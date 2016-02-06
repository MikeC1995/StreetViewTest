'use strict';

var app = angular.module('app', []);
app.controller('appController', function($scope) {
  $scope.key = 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48';
  $scope.viewA = {
    size: '640x640',
    latlng: '51.455916, -2.604753',
    fov: '90',
    heading: '20',
    pitch: '35'
  };

  $scope.viewB = {
    size: '640x640',
    latlng: '51.455916, -2.604753',
    fov: '90',
    heading: '20',
    pitch: '35'
  };

  Math.toRadians = function(x) {
    return x * Math.PI / 180;
  }

  //http://www.movable-type.co.uk/scripts/latlong.html
  $scope.distance = function(p1, p2) {
    var latlng1 = p1.split(',');
    var latlng2 = p2.split(',');
    var lat1 = parseFloat(latlng1[0]);
    var lon1 = parseFloat(latlng1[1]);
    var lat2 = parseFloat(latlng2[0]);
    var lon2 = parseFloat(latlng2[1]);

    var R = 6371000; // metres
    var φ1 = Math.toRadians(lat1);
    var φ2 = Math.toRadians(lat2);
    var Δφ = Math.toRadians(lat2-lat1);
    var Δλ = Math.toRadians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;
  }

});
