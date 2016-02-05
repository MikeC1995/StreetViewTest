'use strict';

var app = angular.module('app');
app.directive('streetView', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: true,
      templateUrl: '/app/street-view/street-view.view.html',
      link: function(scope, elem, attrs) {

      }
  };
});
