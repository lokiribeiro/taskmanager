import {app} from '/client/app.js';
import Projects from '/imports/models/projects.js';

class DashboardCtrl{

  constructor($scope, $timeout, $window, $mdSidenav, $log, $mdDialog, $state, $stateParams){
      'ngInject';

      /*angular.element(document).ready(function () {
          $scope.userDetails = Meteor.userId();
          var verified = Meteor.user();
          var emailVerified = verified.emails.verified;
          console.info('emailVerified', verified);
          if (!emailVerified) {
            $mdDialog.show({
              clickOutsideToClose: false,
              escapeToClose: false,
              transclude: true,
              locals: {
                userDetails: $scope.userDetails
              },
              controller: function($mdDialog, userDetails, $scope) {
                  $scope.userDetails = userDetails;

                  $scope.removeNow = function() {
                      var userID = $scope.passedId;

                      $scope.done = true;
                      $scope.existing = false;
                      $scope.createdNow = !$scope.createdNow;
                      //var status = createUserFromAdmin(details);

                      Meteor.call('sendVerificationLink', userID, function(err, detail) {
                        if (err) {
                          $scope.createdNows = !$scope.createdNows;
                          $scope.done = false;
                          //delete old apps
                          window.setTimeout(function(){
                            $scope.$apply();
                          },2000);
                            //do something with the id : for ex create profile
                          } else {
                            $scope.done = false;
                            $scope.createdNow = !$scope.createdNow;
                            $scope.existing = true;
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
                  templateUrl: 'client/components/admissions/removeDialogs/deleteapplicant.html',
                  targetEvent: $event
                });
              }
      });*/

      $scope.userId = Meteor.userId();
      $scope.sort = 1;
      $scope.subscribe('projects');

      $scope.helpers({
        projects(){
          var selector = {};
          var projects =  Projects.find(selector);
          console.log(projects);
          //themeProvider.setDefaultTheme(statehold);
          return projects;
        }

      });//helpers


      $scope.projected = function (selected) {
        console.info('project', selected);
        var projectId = selected;
        $state.go('Projectpage', { userID : Meteor.userId(), stateHolder : 'Project', projectID : projectId });
      }

      $scope.items = [
        { name: "Add project", icon: "../../assets/img/white_roleadd24.svg", direction: "left" }
      ];

      $scope.openDialog = function($event, item) {
      // Show the dialog
      if(item.name == 'Add project'){
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
        controllerAs: 'createproject',
        controller: DashboardCtrl,
        template: '<createproject></createproject>',
        targetEvent: $event
      });
      }
    }


    }
}

app.component('dashboard', {
    templateUrl: 'client/components/dashboard/dashboard.html',
    controllerAs: 'dashboard',
    controller: DashboardCtrl
})
