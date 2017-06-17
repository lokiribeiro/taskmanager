import { Email } from 'meteor/email';
import { check } from 'meteor/check';

//import Users from '/imports/models/users.js';
Meteor.users.allow({
    insert(userId, user){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, user, fieldNames, modifier){
        //// permission to update only to party owner
        return true;
    },
    remove(userId, user){
        // permission to remove only to party owner
        return true;
    },

});


Meteor.publish('users', function (searchText) {
  var selector = null;
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = { username: searchString };
      //return Meteor.users.find(selector);
  }else{
    selector = {};

  }
  return Meteor.users.find(selector);
});

Meteor.publish('users2', function (searchText) {
  var selector = {_id: searchText};
  return Meteor.users.find(selector);
});

Meteor.publish('usersStudent', function (searchText) {
  var selector = null;
  var role = 'student';
  if(typeof searchText === 'string' && searchText.length){
      var searchString = {$regex: `.*${searchText}.*`, $options: 'i'}
      selector = {role : role, $and  : [
              {name: searchString}
        //{ branchId : branchId },
      ]};
      //return Meteor.users.find(selector);
  }else{
    selector = {role: role};

  }
  return Meteor.users.find(selector);
});


Meteor.methods({

          createUserFromAdmin(email, password){
                var user = Accounts.createUser({email:email, password:password});
                return user;
            },
            deleteUserFromAdmin(userDel){
              Meteor.users.remove({_id: userDel});
            },
            upsertNewBranchFromAdmin(userID, userBranch){
              var selector = {_id: userID};
              var modifier = {$set: {
                branchId: userBranch
              }};
              var branchUpsert = Meteor.users.upsert(selector, modifier);
              return branchUpsert;
            },
            upsertUserFromAdmin(userID, userFirstname){
              var userType = "user";
              var selector = {_id: userID};
              var modifier = {$set: {
                name: userFirstname,
                role: userType
              }};
              var userUpsert = Meteor.users.upsert(selector, modifier);
              return userUpsert;
            },
            upsertProjectUser(profileID, userType, projectID){
              var arrayed = [];
              var selector = {_id: profileID};
              var modifier = {$set: {
                user_projectID: projectID,
                readingList: arrayed
              }};
              var typeUpsert = Meteor.users.upsert(selector, modifier);
              return typeUpsert;
            },
            upsertDoneReading(taskID, readingTitle, userID, activity){
                      var selector = {_id: userID};
                      if(activity === "done") {
                          var modifier = {$push: {readingList: {readingTitle: readingTitle, taskID: taskID, status: true }}}
                      } else {
                          var modifier = {$pull: {readingList: {readingTitle: readingTitle, taskID: taskID }}}
                      }
                      var userUpsert =  Meteor.users.upsert(selector, modifier);
                      return userUpsert;
                    }
})
