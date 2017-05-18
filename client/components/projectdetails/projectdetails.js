import {app} from '/client/app.js';

class ProjectdetailsCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.subscribe('users');
      $scope.projectID = $rootScope.projectID;


          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('projectdetails', {
    templateUrl: 'client/components/projectdetails/projectdetails.html',
    controllerAs: 'projectdetails',
    controller: ProjectdetailsCtrl,
    transclude: true
})
