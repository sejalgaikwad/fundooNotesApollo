const mongoose = require('mongoose');
var schema = mongoose.Schema;
var userSchema = new schema({ // defining the mongodb schema

    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
        unique: [true, "email already exists"]
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean
    },
    gitVerify: {
        type: Boolean,
        default: false
    },
    gitID: {
        type: String
    },
    gitUsername: {
        type: String
    },
    gitToken: {
        type: String
    },
    imageUrl: {
        type: String
    }
}, 
{
    timestamps: true
});
module.exports = mongoose.model('usermodels', userSchema); // exporting the model