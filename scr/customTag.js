varAppName

.controller('TagController', [ '$scope', function($scope) {

  $scope.inputTags = [];
  $scope.tagText = '';

  this.init = function() {
    $scope.$watch('tagText', function(val) {
      $scope.changeFn();
    });
  }

  $scope.onKeyDown = function(event) {
    var keyCode = event.keyCode;
    if ($scope.tagText.length > 0 && keyCode === 9) {
      event.preventDefault();
      $scope.addTag();
    } else if ($scope.tagText.length === 0 && keyCode === 8) {
      event.preventDefault();
      $scope.deleteTag();
    }
  };

  $scope.onKeyUp = function(event) {
    var keyCode = event.keyCode;
    if ($scope.tagText.length > 0) {
      if (keyCode === 13 || keyCode === 32) {
      // enter, space, comma
        event.preventDefault();
        $scope.addTag();
      }
      if (keyCode === 188) {
        event.preventDefault();
        $scope.addTag(true); 
      }
    }
  };

  $scope.addTag = function(stripLastChar) {
    if ($scope.tagText.length == 0) {
      return;
    }

    if (stripLastChar) {
      $scope.tagText = $scope.tagText.slice(0, -1);
    }

    $scope.inputTags.push({name: $scope.tagText});
    $scope.tagText = '';

    updateTags();
  };

  $scope.deleteTag = function() {
    $scope.inputTags.pop();

    updateTags();
  };

  var updateTags = function() {
    var tags = '';
    _.each($scope.inputTags, function(tag) {
      if (tags.length > 0) {
        tags += ',';
      }
      tags += tag.name;
    });
    $scope.tags = tags;
  };

  this.init();

}])

.directive("customTag", function() {
  return {
    restrict: 'AE',
    template: '<div ng-repeat="(key, tag) in inputTags" class="input-tag">' +
    '<span ng-bind="tag.name"></span>' + 
    '<span class="fa fa-close" ng-click="deleteTag(key)"></span>' +
    '</div>' +
    '<input type="text" ng-model="tagText" ng-keyup="onKeyUp($event)" ng-keydown="onKeyDown($event)">',
    scope: {
      tags: '=',
      changeFn: '&',
    },
    controller: 'TagController',
    link: function() {
    }
  }
});
