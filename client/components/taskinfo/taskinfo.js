import {app} from '/client/app.js';

import Tasks from '/imports/models/tasks.js';

class TaskinfoCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.taskID = $rootScope.taskID;
      $scope.userID = $rootScope.userID;

      $scope.show = false;
      $scope.notyet = true;

      $scope.subscribe('tasks2', function () {
          return [$scope.getReactively('taskID')];
      });

      $scope.helpers({      
        tasks(){
          var taskID = $scope.getReactively('taskID');
          console.info('taskID', taskID);
          var selector = {_id : taskID};
          var tasks = Tasks.find(taskID);
          tasks.forEach(function(submit) {
            if(submit.submitList){
              var counted = submit.submitList.length;
              console.info('counted', counted);
              for(x=0;x<counted;x++){
                if(submit.submitList[x].userID == $scope.userID){
                  $scope.notyet = false;
                }
              }
            }
          })
          console.info('tasks', tasks);
          var proNum = tasks.count();
          console.info('pronum', proNum);
          return tasks;
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

      $scope.submitNow = function($event, taskID) {
        var userID = $scope.userID;
        console.info('userID', userID);
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            taskID: $scope.taskID,
            userID: $scope.userID
          },
          transclude: true,
          controller: function($mdDialog, taskID, userID, $scope) {
              $scope.searchTerm = '';
              console.info('projectID', userID);

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;
              $scope.taskname = '';

              $scope.subscribe('tasks2');

              $scope.taskID = taskID;
              $scope.userID = userID;
              var taskDetail = Tasks.findOne($scope.taskID);
              $scope.taskName = taskDetail.taskname;

              $scope.submitTask = function() {
                $scope.done = true;
                $scope.createdNow = true;
                $scope.errorNow = false;
                var taskID = $scope.taskID;
                var userID = $scope.userID;
                var taskName = $scope.taskName;
                var dateNow = new Date();
                console.info('taskname', taskName);
                    //var status = createUserFromAdmin(details);
                $scope.register = Meteor.call('upsertSubmit', taskID, taskName, dateNow, userID, function(err, projectID) {
                      if (err) {
                        $scope.done = false;
                        $scope.errorNow = true;
                        $scope.createdNow = !$scope.createdNow;
                        $scope.existing = true;
                        window.setTimeout(function(){
                          $scope.$apply();
                        },2000);
                        //do something with the id : for ex create profile
                      } else {
                        window.setTimeout(function(){
                          $scope.$apply();
                        },2000);
                        $scope.createdNows = true;
                        $scope.createdNow = true;
                        $scope.done = false;
                      }
                    });
              };

              $scope.createAnother = function() {
                $scope.createdNows = !$scope.createdNows;
                $scope.createdNow = !$scope.createdNow;
                //$scope.createdNow = '1';
              }

              $scope.clearSearchTerm = function() {
                $scope.searchTerm = '';
              };

              $scope.closeDialog = function() {
                $mdDialog.hide();
                //$scope.createdNow = '1';
              }

              $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
              });
          },
          templateUrl: 'client/components/taskinfo/submittask.html',
          targetEvent: $event
        });
      };
    }
}

app.component('taskinfo', {
    templateUrl: 'client/components/taskinfo/taskinfo.html',
    controllerAs: 'taskinfo',
    controller: TaskinfoCtrl,
    transclude: true
})
