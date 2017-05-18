import {app} from '/client/app.js';

class NotfoundCtrl {

  constructor($scope, $reactive, $state){
    'ngInject';
}
}

app.component('notfound', {
  templateUrl: 'client/components/notfound/notfound.html',
  controllerAs: 'notfound',
  controller: NotfoundCtrl
});
