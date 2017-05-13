//todo: poner todos los componentes en el directorio /client/imports => lazy load
//todo: implementar las funciones de rootScope como una factoria

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import 'angular-simple-logger';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';

export var app = angular.module('taskManager',
    [angularMeteor, ngMaterial, uiRouter, 'accounts.ui', ngAnimate]).value('THROTTLE_MILLISECONDS', 250);

app.config(function ($locationProvider, $urlRouterProvider, $stateProvider, $mdThemingProvider, $mdIconProvider, $provide) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $stateProvider
    .state(
        'login', {
            url:'/',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.resolve();
                    } else {
                      return $q.reject('LOGGED_IN');
                    };
                }
              }
    })
    .state(
        'signin', {
            url:'/signin',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (Meteor.userId()) {
                        return $q.reject('LOGGED_IN');
                    } else {
                        return $q.resolve();
                    }
                }
              }
    })
    .state(
        'verify-email', {
            url:'/verify-email/:token',
            template: '<verify></verify>',
            controller: function() {
              Accounts.verifyEmail( params.token, ( error ) =>{
                if ( error ) {
                  console.log('error');
                } else {
                  $state.go('Dashboard');
                }
              })
              }
    })
    .state(
        'register', {
            url:'/register',
            template: '<register></register>'
    })
    .state(
        'not-found', {
            url: '/not-found',
            template: '<notfound></notfound>'
    })
    .state('logout', {
		        url: '/logout',
            template: '<login></login>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                      return $q.reject('LOGGED_IN');
                    } else {
                      return $q.resolve();
                    };
                }
              }
	 })
    .state('Dashboard', {
          url:'/:stateHolder/DSHb/:userID',
          template: '<dashboard></dashboard>',
          resolve: {
              currentUser($q, $state) {
                  if (!Meteor.userId()) {
                      return $q.reject('AUTH_REQUIRED');
                  } else {
                    return $q.resolve();
                  };
              }
          },
          onEnter: function($rootScope, $stateParams, $state) {
              $rootScope.stateHolder = $stateParams.stateHolder;
          }
      })
      .state('Profile', {
            url:'/:stateHolder/PRFl/:userID',
            template: '<profile></profile>',
            resolve: {
                currentUser($q, $state) {
                    if (!Meteor.userId()) {
                        return $q.reject('AUTH_REQUIRED');
                    } else {
                        return $q.resolve();
                    };
                }
            },
            onEnter: function($rootScope, $stateParams, $state) {
                $rootScope.stateHolder = $stateParams.stateHolder;
            }
        });

    $urlRouterProvider.otherwise('/not-found');
  });

app.run(function ($state, $rootScope, $stateParams, $mdTheming) {
    'ngInject';
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
        switch(error) {
          case "AUTH_REQUIRED":
            $state.go('login');
          break;
          case "FORBIDDEN":
            $state.go('forbidden');
          break;
          case "UNAUTHORIZED":
            $state.go('unauthorized');
          break;
          case "LOGGED_IN":
            $state.go('Dashboard');
          break;
          default:
            $state.go('not-found');
        }
    });
    // handle logout event and redirect user to home page
    var _logout = Meteor.logout;
    Meteor.logout = function customLogout() {
        console.log('user loggin out');
        $state.go('login');
        _logout.apply(Meteor, arguments);
    };

    $rootScope.helpers({
        // todo: revisar este helper ya que el usuario se puede obtener
        // todo: en teoria de forma global usando Meteor.user()
        userLoggedIn(){
            return Meteor.user();
        },
        userID(){
            return Meteor.userId();
        },
        userLoggedInRole(){
          var role = null;
          if(Meteor.user()){
            var details = Meteor.user();
            role = details.role;
            console.info('role', role);
          }
          return role;
        },
        userLoggedInBranch(){
          var branch = null;
          if(Meteor.user()) {
            var details = Meteor.user();
            branch = details.branchId;
            console.info('branch', branch);
          }
          return branch;
        }
    });

    userID = function () {
            return Meteor.userId();
    };

    $rootScope.state = $state;

    $rootScope.isEditable = function (party) {
        if(Meteor.user() && party) {
            return Meteor.userId() === party.ownerId;
        }else{
            return false;
        }
    };

    $rootScope.userInvited = function (party) {
        var isInvited = _.findWhere( party.invitedUsers, {userId: Meteor.userId()} ) != null ;
        return isInvited;
    };

    $rootScope.setPrivacity = function (partyId, isPublic) {
        if(isPublic){
            // Making public a party implies it has no ivited users. Everybody can assist
            Parties.update({_id: partyId}, {$set: {public: isPublic, invitedUsers: []}})
        }
        if(!isPublic){
            Parties.update({_id: partyId}, {$set: {public: isPublic}})

        }
    };


});
