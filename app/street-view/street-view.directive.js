'use strict';

var app = angular.module('app');
app.directive('streetView', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: {
        view: '&',
        key: '@'
      },
      templateUrl: '/app/street-view/street-view.view.html',
      link: function(scope, elem, attrs) {
        var v = scope.view();
        scope.url = function() {
          var x =
            'https://maps.googleapis.com/maps/api/streetview?size='
            + v.size
            + '&location=' + v.latlng
            + '&fov=' + v.fov
            + '&heading=' + v.heading
            + '&pitch=' + v.pitch
            + '&key=' + scope.key;
          return x;
        };
      }
  };
});
