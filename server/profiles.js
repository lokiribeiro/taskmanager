import Profiles from '/imports/models/profiles.js';

Profiles.allow({
    insert(userId, profile){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, profile, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, profile){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('profiles', function (selector) {
    if(selector === null){
      selector = {};
    } else if(typeof selector === 'string' && selector.length){
        var searchString = {$regex: `.*${selector}.*`, $options: 'i'}
        selector = { profiles_firstname: searchString };
        //return Meteor.users.find(selector);
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profiles2', function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profiles3', function () {
    return Profiles.find();
});

Meteor.methods({

    upsertProfileFromAdmin(profileID, profileFirstname, profileLastname, profilePhoto, profileType){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profile_Firstname: branchID,
        profile_Lastname: branchName,
        profile_profilephoto: profilePhoto,
        profile_type: profileType
      }};
      var userUpsert = Profiles.upsert(selector, modifier);
      return userUpsert;
    },
    upsertProfilePhoto(profileID, downloadUrl){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
          profiles_profilephoto: downloadUrl
        }};
      var photoUpsert = Profiles.upsert(selector, modifier);
      return photoUpsert;
    },
    upsertProjectFromUser(profileID, userType, projectID){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_projectID: projectID
      }};
      var typeUpsert = Profiles.upsert(selector, modifier);
      return typeUpsert;
    },


})
