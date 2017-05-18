export default Tasks = new Mongo.Collection('tasks');

Tasks.allow({
    insert(userId, task){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, task, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, task){
        // permission to remove only to party owner
        return true;
    },

});
