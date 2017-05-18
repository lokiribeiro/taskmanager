import Projects from '/imports/models/projects.js';

Projects.allow({
    insert(userId, project){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, project, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, project){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('projects', function (selector) {
      selector = {};
      return Projects.find(selector);
});

Meteor.publish('projectsTask', function(query) {
  var selector = query;
  return Projects.find(selector);
});

Meteor.methods({
            deleteProject(userDel){
              Projects.remove({_id: userDel});
            }
})
