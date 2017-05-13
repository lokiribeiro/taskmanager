import {app} from '/client/app.js';
import { name as Login } from '../login/login';

class RegisterCtrl{

      constructor($scope, $reactive, $state) {
        'ngInject';

        this.$state = $state;

        $reactive(this).attach($scope);

        this.credentials = {
          email: '',
          password: ''
        };

        this.error = '';

        $details = this.credentials;

        $scope.registerUser = function($details) {
          console.log('heya:' + $details);

          Accounts.createUser($details,
            this.$bindToContext((err) => {
              if (err) {
                this.error = err;
              } else {
                $state.go('parties');
              }
            })
          );
        }
      }
};

app.component('register', {

    templateUrl: 'client/components/register/register.html',
    controllerAs: 'register',
    controller: RegisterCtrl
});
