import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';
import Projects from '/imports/models/projects.js';
import Tasks from '/imports/models/tasks.js';


class SubmissionCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.taskID = null;

      $scope.selected2 = [];
      $scope.projectID = $rootScope.projectID;
      console.info('projectID', $scope.projectID );
      var projectID =   $scope.projectID ;

      $scope.show = false;

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.page2 = 1;
      $scope.sort = 1;
      $scope.searchText = null;
      $scope.searchText2 = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;
      $scope.last = false;

      $scope.sort2 = 1;
      $scope.enabled = [];
      $scope.installed = [];

      $scope.subscribe('tasks', function () {
          return [$scope.getReactively('searchText')];
      });

      $scope.subscribe('users');
      $scope.subscribe('projects');
      $scope.subscribe('profiles3');

      $scope.helpers({
        profiles() {
            var projectID = $scope.projectID;
            var type = 'user';
            var selector = {profiles_projectID: projectID, $and: [{profiles_type: type}]};
            var limit = parseInt( $scope.perPage );
            var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
            var sort  = $scope.getReactively('sort');
            var profiles = Profiles.find(
                selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
            );
            return profiles;
        },
        totalProfiles() {
            var projectID = $scope.projectID;
            var type = 'user';
            var selector = {profiles_projectID: projectID, $and: [{profiles_type: type}]};
            var limit = parseInt( $scope.perPage );
            var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
            var sort  = $scope.getReactively('sort');
            var profiles = Profiles.find(
                selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
            );
            var count = profiles.count();
            return count;
        },
          tasks(){
            //var sort = 1;
            //var selector = {};
            //var modifier= {sort: {profiles_firstname: sort}};
            var projectID = $scope.projectID;
            var selector = {project_id: projectID};
            var tasks = Tasks.find(selector);
            var count = tasks.count();
            console.info('profiles', tasks);
            console.info('count', count);
            return tasks;
          },
          users(){
                    var sort  = 1;
                    var selector = {};
                    var users = Meteor.users.find(
                          selector, { sort: {name: sort} }
                      );
                    return users;
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
        console.info('selected:', selected2[0]._id);
        var taskID = selected2[0]._id;
        $state.go('Task', {stateHolder : 'Task', userID : Meteor.userId(), taskID : taskID});
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

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.showMore = function () {
          $scope.show = !$scope.show;
      };

      $scope.addTask = function($event, projectID) {
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            projectID: $scope.projectID
          },
          transclude: true,
          controller: function($mdDialog, projectID, $scope) {
              $scope.searchTerm = '';
              console.info('projectID', projectID);

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;
              $scope.taskname = '';

              $scope.subscribe('tasks');

              $scope.projectID = projectID;

              $scope.addTaskDb = function(details) {
                $scope.done = true;
                $scope.createdNow = true;
                $scope.errorNow = false;
                var projectID = $scope.projectID ;
                var taskname = details;
                var dateNow = new Date();
                console.info('taskname', taskname);
                    //var status = createUserFromAdmin(details);
                $scope.register = Meteor.call('upsertTaskFromProject', projectID, taskname, dateNow, function(err, projectID) {
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
          templateUrl: 'client/components/addtask/addtask.html',
          targetEvent: $event
        });
      };
      $scope.removeTask = function($event, item) {
        // Show the dialog
        console.info('unassign', item[0]._id);
        $scope.passedId = item[0]._id;
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            passedId: $scope.passedId
          },
          transclude: true,
          controller: function($mdDialog, passedId, $scope) {
              $scope.passedId = passedId;

              $scope.removeNow = function() {
                  var taskID = $scope.passedId;
                  var projectID = '';
                  var status = 'inactive';

                  $scope.done = true;
                  $scope.existing = false;
                  $scope.createdNow = !$scope.createdNow;
                  //var status = createUserFromAdmin(details);
                  $scope.register = Meteor.call('upsertTaskFromList', taskID, projectID, status, function(err, userID) {
                    if (err) {
                      $scope.done = false;
                      $scope.createdNow = !$scope.createdNow;
                      $scope.existing = true;
                      window.setTimeout(function(){
                        $scope.$apply();
                      },2000);
                      //do something with the id : for ex create profile
                    } else {
                      $scope.createdNows = !$scope.createdNows;
                      $scope.done = false;
                      $scope.selected2 = [];
                      $scope.selected = [];
                      //delete old apps
                      window.setTimeout(function(){
                        $scope.$apply();
                      },2000);
                    }
                  });
                }

                $scope.closeDialog = function() {
                  $mdDialog.cancel();
                };
              },
              templateUrl: 'client/components/removetask/removetask.html',
              targetEvent: $event
            });
          }




      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.selected2 = [];
        $scope.searchText = null;
      }


      $scope.$watch('searchText', function (newValue, oldValue) {
        if(!oldValue) {
          bookmark = $scope.page;
        }

        if(newValue !== oldValue) {
          $scope.page = 1;
        }

        if(!newValue) {
          $scope.page = bookmark;
        }
      });


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
      $scope.addStaff = function($event, projectID) {
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            projectID: $scope.projectID
          },
          transclude: true,
          controller: function($mdDialog, projectID, $scope) {
              $scope.searchTerm = '';
              $scope.userType = 'Non-teaching staff';
              console.info('projectID', projectID);
              $scope.userBrID = '';

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;

              $scope.subscribe('users');

              $scope.subscribe('tasks3');

              $scope.helpers({
                users(){
                      var sort  = 1;
                      var selector = {};
                      var users = Meteor.users.find(
                            selector, { sort: {name: sort} }
                        );
                      return users;
                  }
              });

              $scope.projectID = projectID;

              $scope.addUsers = function(details) {
                $scope.done = true;
                $scope.createdNow = false;
                $createdNows = false;
                var projectID = $scope.projectID ;
                var userType = $scope.userType;
                var max = details.user.length;
                console.info('max', max);

                if(max > 1){
                  for(i=0;i<max;i++){
                    var userID = details.user[i]._id;
                    //var status = createUserFromAdmin(details);
                    $scope.register = Meteor.call('upsertProjectFromUser', userID, userType, projectID, function(err, userID) {
                      if (err) {
                         console.log('error here');
                        //do something with the id : for ex create profile
                      } else {
                       console.log('continue next user');
                      }
                    });
                    $scope.register = Meteor.call('upsertProjectUser', userID, userType, projectID, function(err, userID) {
                      if (err) {
                         console.log('error here');
                        //do something with the id : for ex create profile
                      } else {
                       console.log('continue next user');
                      }
                    });
                    //var selector = {project_id: projectID};
                    }
                    window.setTimeout(function(){
                      $scope.$apply();
                    },2000);
                    $scope.createdNows = true;
                    $scope.createdNow = true;
                    $scope.done = false;
                  } else if(max == 1) {
                    $scope.createdNow = !$scope.createdNow;
                    var userID = details.user[0]._id;
                    console.info('userID', userID);
                    $scope.register = Meteor.call('upsertProjectUser', userID, userType, projectID, function(err, userID) {
                      if (err) {
                         console.log('error here');
                        //do something with the id : for ex create profile
                      } else {
                       console.log('continue next user');
                      }
                    });

                    $scope.register = Meteor.call('upsertProjectFromUser', userID, userType, projectID, function(err, userID) {
                      if (err) {
                        $scope.done = false;
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
                  } else {
                    console.log('nothing to do');
                    $scope.done = false;
                    $scope.createdNow = false;
                  }
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
          templateUrl: 'client/components/submission/adduser.html',
          targetEvent: $event
        });
      }


      $scope.viewSubmission = function($event, submissionDetails) {
        $scope.submissionDetails = submissionDetails;
        console.info('userID', submissionDetails);
        $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          locals: {
            submissionDetails: $scope.submissionDetails
          },
          transclude: true,
          controller: function($mdDialog, submissionDetails, $scope) {
              $scope.searchTerm = '';
              console.info('projectID', submissionDetails);
              $scope.submissionDetails = submissionDetails;

              $scope.done = false;
              $scope.existing = false;
              $scope.createdNow = false;
              $scope.createdNows = false;
              $scope.taskname = '';

              $scope.subscribe('tasks2');

              $scope.helpers({
                tasks(){
                  var taskID = $scope.getReactively('taskID');
                  console.info('taskID', taskID);
                  var selector = {};
                  var tasks = Tasks.find();
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
              })

              $scope.submitTask = function() {
                $scope.done = true;
                $scope.createdNow = true;
                $scope.errorNow = false;
                var taskID = $scope.taskID;
                var userID = $scope.userID;
                var readingTitle = $scope.readingTitle;
                var comments = $scope.comments;
                var dateNow = new Date();
                console.info('taskname', readingTitle);
                    //var status = createUserFromAdmin(details);
                $scope.register = Meteor.call('upsertBrief', taskID, readingTitle, comments, dateNow, userID, function(err, projectID) {
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
          templateUrl: 'client/components/submission/viewsubmission.html',
          targetEvent: $event
        });
      };
    }
}

app.component('submission', {
    templateUrl: 'client/components/submission/submission.html',
    controllerAs: 'submission',
    controller: SubmissionCtrl,
    transclude: true
})
