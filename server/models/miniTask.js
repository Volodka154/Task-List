const {model, Schema} = require('mongoose');

const miniTaskSchema = new Schema({
    title: {type: String, default: 'Untitled'},
    text: {type: String, default: 'No text'},
    done: { type: Boolean, default: false },
    createAt: {type: String, default: 'Data is undefiend'}
});

module.exports = model('miniTask', miniTaskSchema);