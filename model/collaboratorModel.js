var Mongoose = require("mongoose");

var Schema = Mongoose.Schema;

var collaboratorSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels'
    },
    NoteID: {
        type: Schema.Types.ObjectId,
        ref: 'notesModel'
    },
    collaboratorID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels'
    },
},
    {
        timestamps: true
    })
var collaborateModel = Mongoose.model('colbModel', collaboratorSchema);
module.exports = collaborateModel;