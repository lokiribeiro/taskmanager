import {app} from '/client/app.js';

import Tasks from '/imports/models/tasks.js';

class ReadinglistCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.taskID = $rootScope.taskID;
      $scope.userID = $rootScope.userID;

      $scope.show = false;
      $scope.switches = 'true';

      $scope.subscribe('tasks2', function () {
          return [$scope.getReactively('taskID')];
      });

      $scope.subscribe('users2');

      $scope.helpers({
        tasks(){
          var taskID = $scope.getReactively('taskID');
          console.info('taskID', taskID);
          var selector = {_id : taskID};
          var tasks = Tasks.find(taskID);
          console.info('tasks', tasks);
          var proNum = tasks.count();
          console.info('pronum', proNum);
          return tasks;
        },
        users(){
          var userID = $scope.userID;
          var userDetail = Meteor.users.find(userID);
          var count = userDetail.count();
          console.info('count', count);
          return userDetail;
        }
      })//helpers

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }


      $scope.editNow = function(){
        $scope.show = !$scope.show;
        console.info('userID', $scope.taskID);
      }


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.updateUser = function(details) {
          $scope.show = !$scope.show;
          console.info('userID', $scope.taskID);
          var taskID = $scope.taskID;
          var taskDetails = details;
          console.info(taskDetails);
          Meteor.call('upsertTaskDetails', taskID, taskDetails, function(err, result) {
                if (err) {

                                       var toasted = 'Error editing task details.';
                                       var pinTo = $scope.getToastPosition();
                                       $mdToast.show(
                                         $mdToast.simple()
                                         .textContent(toasted)
                                         .position(pinTo )
                                         .hideDelay(3000)
                                         .action('HIDE')
                                         .highlightAction(true)
                                         .highlightClass('md-accent')
                                       );
                                       $scope.doneSearching = false;


               } else {
                 var toasted = 'Task details updated';
                 var pinTo = $scope.getToastPosition();
                 $mdToast.show(
                   $mdToast.simple()
                   .textContent(toasted)
                   .position(pinTo )
                   .hideDelay(3000)
                   .action('HIDE')
                   .highlightAction(true)
                   .highlightClass('md-accent')
                 );
                 $scope.doneSearching = false;

               }
             });


        }
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
      $scope.newReading = function($event, item) {
      // Show the dialog
      $mdDialog.show({
        clickOutsideToClose: false,
        escapeToClose: true,
        controller: function($mdDialog) {
          // Save the clicked item
          $scope.FABitem = item;
          // Setup some handlers
          $scope.close = function() {
            $mdDialog.cancel();
          };
        },
        controllerAs: 'createreading',
        controller: ReadinglistCtrl,
        template: '<createreading></createreading>',
        targetEvent: $event
      });
    }

    $scope.deleteNew = function(link) {
    // Show the dialog
    var taskID = $scope.taskID;
    console.info('taskID', taskID);
    var linked = link.link;
    var readingTitle = link.readingTitle;
      $scope.doneSearching = true;
    Meteor.call("upsertawayReading", taskID, readingTitle, linked, function(error, result){
      if (error) {
        var toasted = 'Error editing task details.';
        var pinTo = $scope.getToastPosition();
        $mdToast.show(
          $mdToast.simple()
          .textContent(toasted)
          .position(pinTo )
          .hideDelay(3000)
          .action('HIDE')
          .highlightAction(true)
          .highlightClass('md-accent')
        );
        $scope.doneSearching = false;

     } else {
       var toasted = 'Task details updated';
       var pinTo = $scope.getToastPosition();
       $mdToast.show(
         $mdToast.simple()
         .textContent(toasted)
         .position(pinTo )
         .hideDelay(3000)
         .action('HIDE')
         .highlightAction(true)
         .highlightClass('md-accent')
       );
       $scope.doneSearching = false;
     }
    });

  }

  $scope.markRead = function(readingTitle) {
    var userID = $scope.userID;
    var readingTitle = readingTitle;
    var taskID = $scope.taskID;
    var activity = 'done';

    var userDetail = Meteor.users.find(userID);
    userDetail.forEach(function(userapp){
      if(userapp.readingList){
        var counter = userapp.readingList.length;
        for(x=0;x<counter;x++){
          if(userapp.readingList[x].readingTitle == readingTitle){
            console.info('found', userapp.readingList[x].readingTitle);
            activity = 'undone'
          }
        }
      }
    });



    Meteor.call('upsertDoneReading', taskID, readingTitle, userID, activity, function(err, result) {
          if (err) {

                                 var toasted = 'Error updating reading list.';
                                 var pinTo = $scope.getToastPosition();
                                 $mdToast.show(
                                   $mdToast.simple()
                                   .textContent(toasted)
                                   .position(pinTo )
                                   .hideDelay(3000)
                                   .action('HIDE')
                                   .highlightAction(true)
                                   .highlightClass('md-accent')
                                 );
                                 $scope.doneSearching = false;


         } else {
           var toasted = 'Reading list updated';
           var pinTo = $scope.getToastPosition();
           $mdToast.show(
             $mdToast.simple()
             .textContent(toasted)
             .position(pinTo )
             .hideDelay(3000)
             .action('HIDE')
             .highlightAction(true)
             .highlightClass('md-accent')
           );
           $scope.doneSearching = false;

         }
       });


  }


    }
}

app.component('readinglist', {
    templateUrl: 'client/components/readinglist/readinglist.html',
    controllerAs: 'readinglist',
    controller: ReadinglistCtrl,
    transclude: true
})
