import {app} from '/client/app.js';

import { name as Register } from '../register/register';


class LoginCtrl {

  constructor($scope, $reactive, $state){
    'ngInject';

     $('body').addClass('loginP');

    this.$state = $state;

    $scope.loginerror = '';

    $reactive(this).attach($scope);

    this.credentials = {
      username: '',
      password: ''
    };

    this.error = '';

    $log = this.credentials;

    $scope.login = function($log) {
    Meteor.loginWithPassword($log.username, $log.password,
      this.$bindToContext((err) => {
        if (err) {
          $scope.loginerror = err.reason;
              console.info('err: ' ,   $scope.loginerror );
          } else {
            $state.go('Dashboard', { userID : Meteor.userId(), stateHolder : 'Dashboard' });
          }
        })
      );
    }

    $scope.onSignIn = function (googleUser) {
      var id_token = googleUser.getAuthResponse().id_token;
      var profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
    };

    $scope.signOut = function() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  };

  }
}

app.component('login', {
  templateUrl: 'client/components/login/login.html',
  controllerAs: 'login',
  controller: LoginCtrl
});
