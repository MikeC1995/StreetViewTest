'use strict';

var app = angular.module('app', []);
app.controller('appController', ['$scope', '$http', function($scope, $http) {
  $scope.key = 'AIzaSyCP5BKla9RY0aObtlovjVzIBV2XEsfYj48';
  $scope.viewA = {
    size: '640x640',
    latlng: '51.455916, -2.604753',
    fov: '90',
    heading: '20',
    pitch: '35'
  };

  $scope.theta = 20;
  $scope.latlng = '51.455916, -2.604753';
  $scope.getImages = function() {
    var heading;
    for(var i = 0; i < Math.floor(360/$scope.theta); i++) {
      heading = i * $scope.theta;
      console.log(heading);
      var pitch = 35;

      var url =
        'https://maps.googleapis.com/maps/api/streetview?size=640x640'
        + '&location=' + $scope.latlng
        + '&fov=' + $scope.theta
        + '&heading=' + heading
        + '&pitch=' + pitch
        + '&key=' + $scope.key;

      $http.get(url, {responseType:'blob'})
        .then((function(heading) {
          return function(results){
            var data = results.data;
            var blob = new Blob(
                [data],
                {type: "image/jpg"}
            );
            saveAs(blob, 'sv-' + heading + '.jpg');
          }
        })(heading));
    }
  }

}]);
