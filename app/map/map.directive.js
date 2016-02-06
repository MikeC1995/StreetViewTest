'use strict';

var app = angular.module('app');
app.directive('map', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id'
      },
      controller: ['$scope', function($scope) {
        $scope.density = 20;  // density of street view point mesh
        $scope.coords = [];   // list of street view-able lat-lng coords

        /* Computes a mesh of lat-lng coords in the bbox spanning
        ** sw to ne with specified density.
        */
        function computeLatLngMesh(sw, ne, density) {
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

        /* Callback for sv.getPanorama
        ** If the requested coordinate has Street View data, this
        ** coordinate is added to the list and a marker added to the map.
        */
        function processSVData(data, status) {
          if (status === google.maps.StreetViewStatus.OK) {
            var latlng = {
              lat: data.location.latLng.lat(),
              lng: data.location.latLng.lng(),
            }
            $scope.coords.push(latlng);
            addMarker(latlng);
          }
        }

        /* Calls sv.getPanorama for each coordinate in a mesh.
        ** The coordinates which have Street View data will be added to
        ** $scope.coords and a marker added to the map.
        */
        function filterStreetView(coords) {
          for(var i = 0; i < coords.length; i++) {
            $scope.sv.getPanorama({location: coords[i], radius: 50}, processSVData);
          }
        }

        // Adds a marker to the map.
        function addMarker(latlng) {
          new google.maps.Marker({
            position: latlng,
            map: $scope.map
          });
        }

        // Computes a mesh of lat-lng coords and filters them for SV data.
        function addMesh(latlng1, latlng2) {
          var mesh = computeLatLngMesh(latlng1, latlng2, $scope.density);
          filterStreetView(mesh);
        }

        /* Called when user click on the map.
        ** First click sets the sw corner of the bbox.
        ** Second click sets the ne corner of the bbox, and builds the mesh.
        */
        $scope.addMeshCorner = function(latlng) {
          if($scope.sw === undefined) {
            $scope.sw = latlng;
            addMarker($scope.sw);
          } else if($scope.ne === undefined) {
            $scope.ne = latlng;
            addMesh($scope.sw, $scope.ne)
          }
        }
      }],
      link: function($scope, elem, attrs) {
        // Loads google map script
        loadGoogleMapAPI.then(function () {
            $scope.initialize();
        }, function () {
            console.error("Couldn't load Google Maps API!");
        });

        $scope.initialize = function() {
          $scope.sv = new google.maps.StreetViewService();
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
