'use strict';

var app = angular.module('app');
app.directive('controls', function() {
  return {
      restrict: 'E',
      replace: 'true',
      scope: {
        view: '='
      },
      templateUrl: '/app/controls/controls.view.html',
      link: function(scope, elem, attrs) {
      }
  };
});
