const {model, Schema} = require('mongoose');

const taskSchema = new Schema({
    title: {type: String, default: 'Untitled'},
    done: { type: Boolean, default: false },
    tasks: []
});

module.exports = model('Task', taskSchema);