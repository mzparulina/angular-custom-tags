varAppName
.controller('TagController', [ '$scope', function($scope) {

  $scope.inputTags = [];
  $scope.tagText = '';

  var self =this;

  this.init = function() {
    initTags();

    $scope.$watch('tags', function(val) {
      $scope.changeFn();
    });
  }

  $scope.onKeyDown = function(event) {
    var keyCode = event.keyCode;
    if ($scope.tagText.length > 0 && keyCode === 9) {
      //tab
      event.preventDefault();
      $scope.addTag();
    } else if ($scope.tagText.length === 0 && keyCode === 8) {
      //backspace
      event.preventDefault();
      $scope.deleteTag();
    } else if (keyCode === 32 || keyCode === 13 || keyCode === 188) {
      //space, enter, comma
      event.preventDefault();
      if($scope.tagText.length > 0) {
        $scope.addTag();
      }
    }
  };

  $scope.onKeyUp = function(event) {
    var keyCode = event.keyCode;
    if (keyCode === 8 || keyCode === 9 || keyCode === 13 || keyCode === 32 || keyCode === 188) {
      event.preventDefault();
    }
  };

  var initTags = function() {
    if($scope.tags && $scope.tags.length > 0){
      var newTags = $scope.tags.split(",");
      _.each(newTags, function(tag){
        $scope.inputTags = _.union($scope.inputTags, [tag.trim()]);
      })
      $scope.tagText = '';
      updateTags();
    }
  };

  $scope.addTag = function(stripLastChar) {
    if ($scope.tagText.length == 0) {
      return;
    }

    if (stripLastChar) {
      $scope.tagText = $scope.tagText.slice(0, -1);
    }

    $scope.inputTags = _.union($scope.inputTags, [$scope.tagText]);
    $scope.tagText = '';

    updateTags();
  };

  $scope.deleteTag = function(tag) {
    if (tag) {
      $scope.inputTags = _.without($scope.inputTags, tag);
    } else {
      $scope.inputTags.pop();
    }
    updateTags();
  };

  var updateTags = function() {
    var tags = '';
    _.each($scope.inputTags, function(tag) {
      if (tags.length > 0) {
        tags += ',';
      }
      tags += tag;
    });
    $scope.tags = tags;
  };

  this.init();

}])

.directive('customTag', function() {
  return {
    restrict: 'AE',
    template: '<div ng-repeat="tag in inputTags" class="input-tag">' +
    '<span ng-bind="tag"></span>' + 
    '<span class="fa fa-close" ng-click="deleteTag(tag)"></span>' +
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
