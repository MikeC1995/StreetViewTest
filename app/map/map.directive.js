'use strict';

var app = angular.module('app');
app.directive('map', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id'
      },
      controller: ['$scope', function($scope) {
        $scope.density = 20;

        // Function for computing a mesh of lat long coordinates
        // within the bbox given by the south-west and north-easterly points,
        // with a given density.
        $scope.computeLatLngMesh = function(sw, ne, density) {
          var lat_step = (ne.lat - sw.lat)/density;
          var lng_step = (ne.lng - sw.lng)/density;
          var coords = [];
          for(var i = 0; i <= density; i++) {
            for(var j = 0; j <= density; j++) {
              coords.push({
                lat: sw.lat + j * lat_step,
                lng: sw.lng + i * lng_step
              });
            }
          }
          return coords;
        }

        function addMarker(latlng) {
          new google.maps.Marker({
            position: latlng,
            map: $scope.map
          });
        }

        $scope.addMeshCorner = function(latlng) {
          if($scope.sw === undefined) {
            $scope.sw = latlng;
            addMarker($scope.sw);
          } else if($scope.ne === undefined) {
            $scope.ne = latlng;
            $scope.addMesh($scope.sw, $scope.ne)
          }
        }

        $scope.addMesh = function(latlng1, latlng2) {
          var coords = $scope.computeLatLngMesh(latlng1, latlng2, $scope.density);
          for(var i = 0; i < coords.length; i++) {
            addMarker(coords[i]);
          }
        }

      }],
      link: function($scope, elem, attrs) {
        // Loads google map script
        loadGoogleMapAPI.then(function () {
            // Promised resolved
            $scope.initialize();
        }, function () {
            // Promise rejected
            console.error("Couldn't load Google Maps API!");
        });

        $scope.initialize = function() {
          $scope.map = new google.maps.Map(document.getElementById($scope.mapId), {
            zoom: 10,
            center: {lat: 51.552015, lng: -2.452623}
          });

          google.maps.event.addListener($scope.map, "click", function (e) {
            var latlng = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            }
            $scope.addMeshCorner(latlng);
          });
        }
      }
  };
}]);
