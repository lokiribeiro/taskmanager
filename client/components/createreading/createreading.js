import {app} from '/client/app.js';
import Tasks from '/imports/models/tasks.js';

class CreatereadingCtrl{

  constructor($scope, $timeout, $reactive, $mdSidenav, $log, $mdDialog, $state, $rootScope){
      'ngInject';

      //helpers
      this.$state = $state;
      $scope.taskID = $rootScope.taskID;

      $reactive(this).attach($scope);

      $scope.createdNow = false;
      $scope.createdNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.canCreateProfile = false;

      this.credentials = {
        readingTitle: '',
        link: ''
      };

      this.register = {
        readingTitle: '',
        link: ''
      }

      this.error = '';

      //var details = this.credentials;
      var details = this.register;

      console.info('details: ', details);

      $scope.newReading = function(details) {
        var detail = details;
        var taskID = $scope.taskID;

        console.info('detail', details);
        var readingTitle = detail.readingTitle;
        var link = detail.link;

        $scope.done = true;
        $scope.existing = false;
        $scope.createdNow = !$scope.createdNow;
        //var status = createUserFromAdmin(details);

         Meteor.call('upsertReadingList', taskID, readingTitle, link, function(err, result) {
               if (err) {

                 $scope.done = false;
                 $scope.createdNow = !$scope.createdNow;
                 $scope.existing = true;
                 window.setTimeout(function(){
                 $scope.$apply();
               },2000);


              } else {
                $scope.registered = details;
                $scope.createdNows = !$scope.createdNows;
                $scope.done = false;
                //simulation purposes
                window.setTimeout(function(){
                $scope.$apply();
              },2000);

              }
            });
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

app.component('createreading', {
    templateUrl: 'client/components/createreading/createreading.html',
    controllerAs: 'createreading',
    controller: CreatereadingCtrl
})
