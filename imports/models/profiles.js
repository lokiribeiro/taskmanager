export default Profiles = new Mongo.Collection('profiles');

Profiles.allow({
    insert(userId, profile){
        // permission to insert only to authenticated users
        return userId === null;
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
