export default Projects = new Mongo.Collection('projects');

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
