'use strict';

var app = angular.module('app', []);
app.controller('appController', function($scope) {
  $scope.key = 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48';
  $scope.viewA = {
    size: '640x640',
    lat: '51.455916',
    lng: '-2.604753',
    fov: '90',
    heading: '20',
    pitch: '35'
  };

  $scope.viewB = {
    size: '640x640',
    lat: '51.455916',
    lng: '-2.604753',
    fov: '90',
    heading: '20',
    pitch: '35'
  };
  /*
  $scope.viewA = new function() {
    this.size = '640x640';
    this.lat = '51.455916';
    this.lng = '-2.604753';
    this.fov = '90';
    this.heading = '20';
    this.pitch = '35';
  }

  $scope.viewB = new function() {
    this.size = '640x640';
    this.lat = '51.455916';
    this.lng = '-2.604753';
    this.fov = '90';
    this.heading = '20';
    this.pitch = '35';
  }*/
});

/*    this.url = function() {
      var x =
        'https://maps.googleapis.com/maps/api/streetview?size='
        + this.size
        + '&location=' + this.lat + ',' + this.lng
        + '&fov=' + this.fov
        + '&heading=' + this.heading
        + '&pitch=' + this.pitch
        + '&key=' + $scope.key;
        return x;
    };
  };*/
