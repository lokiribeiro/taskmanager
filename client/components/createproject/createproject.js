import {app} from '/client/app.js';
import Projects from '/imports/models/projects.js';

class CreateprojectCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state){
      'ngInject';



      //helpers
      this.$state = $state;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        projectName: '',
        timeline: '',
        field: '',
        location: ''
      };

      this.register = {
        projectName: '',
        timeline: '',
        field: '',
        location: ''
      }

      this.error = '';

      //var details = this.credentials;
      var details = this.register;

      console.info('details: ', details);

      $scope.createProject = function(details) {
        var detail = details;

        console.info('detail', details);

        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

        var project = [];

        project.project_name = details.projectName;
        project.timeline = details.timeline;
        project.field = details.field;
        project.location = details.location;
        //branch.userpic = details.schooladmin.userpic;

        var status = Projects.insert(project);
        if (status) {
          $scope.registered = details;
          $scope.createdNows = !$scope.createdNows;
          $scope.done = false;
          //simulation purposes
          window.setTimeout(function(){
          $scope.$apply();
        },2000);

         } else {
           //do something with the id : for ex create profile
           $scope.done = false;
           $scope.createdNow = !$scope.createdNow;
           $scope.existing = true;
           window.setTimeout(function(){
           $scope.$apply();
         },2000);
         }
    }

      $scope.createAnother = function() {
         $scope.createdNows = !$scope.createdNows;
         $scope.createdNow = !$scope.createdNow;
         //$scope.createdNow = '1';
      }

      $scope.closeDialog = function() {
         $mdDialog.hide();
         //$scope.createdNow = '1';
       }

}
}

app.component('createproject', {
    templateUrl: 'client/components/createproject/createproject.html',
    controllerAs: 'createproject',
    controller: CreateprojectCtrl
})
