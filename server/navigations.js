import Navigations from '/imports/models/navigations.js';

//Meteor.publish('navigations', function (stateHolder) {
//var selector = null;
//  selector = {appName: stateHolder};
//  return Navigations.find(selector);
//});
Meteor.publish('navigations', function (stateHolder) {
  var selector = {appName: stateHolder};
  var sort = 1;
  var navigations = Navigations.find(
    selector, {sort: {appName: sort}}
  );
    return navigations;
});
