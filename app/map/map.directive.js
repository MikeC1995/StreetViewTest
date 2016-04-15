'use strict';

var app = angular.module('app');
app.directive('map', ['loadGoogleMapAPI', function(loadGoogleMapAPI) {
  return {
      restrict: 'A',
      scope: {
        mapId: '@id',
        getPlaces: '='
      },
      controller: ['$scope', function($scope) {
        $scope.density = 20;  // density of street view point mesh
        $scope.coords = [];   // list of street view-able lat-lng coords

        // Writes the mesh coords to a text file and saves to computer
        function saveCoords() {
          var coordsString = "";
          for(var i = 0; i < $scope.coords.length; i++) {
            coordsString += ($scope.coords[i].lat + "," + $scope.coords[i].lng + ":");
          }
          var blob = new Blob([coordsString], {type: "text/plain;charset=utf-8"});
          saveAs(blob, "coords.txt");
        }
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
          var marker = new google.maps.Marker({
            position: latlng,
            map: $scope.map
          });
          marker.addListener('click', function() {
            console.log(marker.getPosition().lat() + ", " + marker.getPosition().lng());
          });
        }

        // Computes a mesh of lat-lng coords and filters them for SV data.
        function addMesh(latlng1, latlng2) {
          var mesh = computeLatLngMesh(latlng1, latlng2, $scope.density);
          filterStreetView(mesh);
        }

        /* Called when user click on the map.
        ** First click sets the sw corner of the bbox.
        ** Second click sets the ne corner of the bbox, and builds the mesh
        ** Third click downloads the mesh coords file.
        */
        $scope.addMeshCorner = function(latlng) {
          if($scope.sw === undefined) {
            $scope.sw = latlng;
            addMarker($scope.sw);
          } else if($scope.ne === undefined) {
            $scope.ne = latlng;
            addMesh($scope.sw, $scope.ne)
          } else {
            saveCoords();
          }
        }

        // Create the PlaceService and send the request.
        // Handle the callback with an anonymous function.
        $scope.getPlaces = function(latlng) {
          if($scope.service == undefined) return;
          var request = {
            location: {
              lat: Number(latlng.split(",")[0]),
              lng: Number(latlng.split(",")[1])
            },
            radius: '100'
          };
          $scope.service.nearbySearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                var place = results[i];
                console.log(place);
                // If the request succeeds, draw the place location on
                // the map as a marker, and register an event to handle a
                // click on the marker.
                var marker = new google.maps.Marker({
                  map: $scope.map,
                  position: place.geometry.location,
                  _place: place
                });
                marker.addListener('click', function() {
                  console.log(this._place);
                });
              }
            }
          });
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
            zoom: 15,
            center: {lat: 51.455916, lng: -2.604753}
          });

          google.maps.event.addListener($scope.map, "click", function (e) {
            var latlng = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            }
            $scope.addMeshCorner(latlng);
            console.log(latlng);
          });

          $scope.service = new google.maps.places.PlacesService($scope.map);
        }
      }
  };
}]);
