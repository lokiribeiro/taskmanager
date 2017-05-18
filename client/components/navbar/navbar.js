import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';

class NavbarCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $mdComponentRegistry, $stateParams){
      'ngInject';

      $scope.userId = Meteor.userId();
      $scope.profileID = $scope.userId;


      $scope.sort = 1;
      //$scope.stateHolder = null;
      $scope.stateHolder = $stateParams.stateHolder;

      $scope.subscribe('profiles2', function () {
          return [$scope.getReactively('userId')];
      });

      $scope.helpers({
        profiles() {
              var profileID = $scope.getReactively('userId');
              var selector = {profiles_userID : profileID};
              var profiles = Profiles.find(selector);
              var roleName = '';

              profiles.forEach(function(profile) {
                $scope.rolesID = profile.profiles_userroleID;
              });
              var count = profiles.count();

              return profiles;
      }
      });//helpers

      $scope.redirect = function (appName) {
        $state.go(appName, { stateHolder : appName, userID : $scope.userId });
      }

      $scope.redirectProfile = function () {
        $state.go('Profile', {stateHolder : 'Dashboard', userID : $scope.userId});
      }

    $scope.logout = function() {
        Accounts.logout();
        $state.go('logout');
      }

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }




    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.isOpenLeft = function(){
      return $mdSidenav('left').isOpen();
    }

    $scope.close = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          //$log.debug("close LEFT is done");
        });
    }

    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            //$log.debug("toggle " + navID + " is done");
          });
      }
    }

    var originatorEv;

    this.menuHref = "http://www.google.com/design/spec/components/menus.html#menus-specs";

    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    this.announceClick = function(index) {
      $mdDialog.show(
        $mdDialog.alert()
          .title('You clicked!')
          .textContent('You clicked the menu item at index ' + index)
          .ok('Nice')
          .targetEvent(originatorEv)
      );
      originatorEv = null;
    };

    //This sets up a trigger event when the sidenav closes
   $scope.sideNavIsOpen = function() {
       return false;
   };

   $mdComponentRegistry.when('left').then(function(sideNav) {
       $scope.sideNavIsOpen = angular.bind(sideNav, sideNav.isOpen);
   });

   $scope.$watch('sideNavIsOpen()', function() {
       if(!$scope.sideNavIsOpen()) {
           $('body').removeClass('not-scrollable');
       }
       else {
           $('body').addClass('not-scrollable');
       }
   });

  }
}

app.component('navbar', {
    templateUrl: 'client/components/navbar/navbar.html',
    controllerAs: 'navbar',
    controller: NavbarCtrl
});
