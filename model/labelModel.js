var Mongoose = require('mongoose');

let Schema = Mongoose.Schema;

var labelSchema = Schema({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'usermodels',
    },
    labelName: {
        type: String,
        require: [true, 'labelName is required']
    }
},
{
    timestamps: true
});

var labelModel = Mongoose.model('labelModel', labelSchema);
module.exports = labelModel;