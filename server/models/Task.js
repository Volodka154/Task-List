const {model, Schema} = require('mongoose');

const taskSchema = new Schema({
    title: {type: String, default: 'Untitled', required: true},
    done: {type: Boolean, default: false },
    tasks: []
});

module.exports = model('Task', taskSchema);