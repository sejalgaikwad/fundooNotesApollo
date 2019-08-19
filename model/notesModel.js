var Mongoose = require('mongoose');
let Schema = Mongoose.Schema;

var notesSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'userSchema'
    },

    labelID: {
        type: Schema.Types.ObjectId,
        ref: 'labelSchema'
    },

    title: {
        type: String,
        require: [true, "title is required"]
    },

    description: {
        type: String,
        require: [true, "description is required"]
    },

    archive: {
        type: Boolean,
        default: false
    },

    trash: {
        type: Boolean,
        default: false
    },

    reminders: {
        type: Date
    },

}, {
    timestamps: true
})

var notesModel = Mongoose.model('notesModel', notesSchema);

module.exports = notesModel;