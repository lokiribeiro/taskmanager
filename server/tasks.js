import Tasks from '/imports/models/tasks.js';

Tasks.allow({
    insert(userId, task){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, task, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, tas){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('tasks', function (selector) {
    if(selector === null){
      selector = {};
    } else if(typeof selector === 'string' && selector.length){
        var searchString = {$regex: `.*${selector}.*`, $options: 'i'}
        selector = { task_name: searchString };
        //return Meteor.users.find(selector);
    } else {
      selector = {};
    }

    return Tasks.find(selector);
});

Meteor.publish('tasks2', function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {_id: selector};
    }

    return Tasks.find(selector);
});

Meteor.publish('tasks3', function (selector) {
    if(selector === null){
      selector = {status: "active"};
    } else {
      selector = {project_id: selector, $and  : [
              {status: "active"}
            ]};
    }

    return Tasks.find(selector);
});



Meteor.methods({

    upsertTaskFromProject(projectID, taskname, dateNow){
      var tasks = {
        project_id : '',
        taskname : '',
        createdAt : '',
        status : ''
      }
      tasks.project_id = projectID;
      tasks.taskname = taskname;
      tasks.createdAt = dateNow
      tasks.status = 'active';
      var taskCreate = Tasks.insert(tasks);
      return taskCreate;
    },
    upsertTaskFromList(taskID, projectID, status){
      var selector = {_id: taskID};
      var modifier = {$set: {
        project_id: projectID,
        status: status
      }};
      var typeUpsert = Tasks.upsert(selector, modifier);
      return typeUpsert;
    },
    upsertTaskDetails(taskID, details){
      var selector = {_id: taskID};
      var modifier = {$set: {
        details: details
      }};
      var typeUpsert = Tasks.upsert(selector, modifier);
      return typeUpsert;
    },
    upsertReadingList(taskID, readingTitle, link){
              var selector = {_id: taskID};
              var modifier = {$push: {readingList: {readingTitle: readingTitle, link: link }}}
              var userUpsert =  Tasks.update(selector, modifier);
              return userUpsert;
            },
    upsertawayReading(taskID, readingTitle, link) {
      var selector = {_id : taskID};
      var modifier = {$pull: {readingList: { readingTitle: readingTitle, link : link}}};
      var userUpsert = Tasks.update(selector, modifier);
      return userUpsert;
    },
    upsertSubmit(taskID, taskname, link, comments, dateNow, userID){
      var selector = {_id: taskID};
      var modifier = {$push: {submitList: {taskID: taskID, taskname: taskname, userID: userID, dateNow: dateNow, link: link, comments: comments  }}}
      var userUpsert =  Tasks.update(selector, modifier);
      return userUpsert;
    },
    upsertBrief(taskID, readingTitle, comments, dateNow, userID){
      var selector = {_id: taskID};
      var modifier = {$push: {briefList: {taskID: taskID, readingTitle: readingTitle, userID: userID, dateNow: dateNow, comments: comments  }}}
      var userUpsert =  Tasks.update(selector, modifier);
      return userUpsert;
    }
});
