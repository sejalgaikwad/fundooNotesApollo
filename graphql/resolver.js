
// require mutation files
const register = require('./mutation/userMutaion').register;
const login = require('./mutation/userMutaion').login;
const verifyEmail = require('./mutation/userMutaion').verifyEmail;
const resetpassword = require('./mutation/userMutaion').resetpassword;
const forgotpassword = require('./mutation/userMutaion').forgotpassword;
const createLabel = require('./mutation/labelMutation').createLabel;
const removeLabel = require('./mutation/labelMutation').removeLabel;
const updateLable = require('./mutation/labelMutation').updateLabel;
const createNote = require('./mutation/noteMutation').createNote;
const removeNote = require('./mutation/noteMutation').removeNote;
const updateNote = require('./mutation/noteMutation').updateNote;
const imageUpload=require('../graphql/mutation/imageUpload').imageUpload
const oAuth = require('./mutation/oAuth').oAuth
const gitVerify = require('./mutation/oAuth').verify
const archive=require('./mutation/noteMutation').archive
const unarchive=require('./mutation/noteMutation').unarchive
const trash= require('./mutation/noteMutation').trash
const untrash= require('./mutation/noteMutation').untrash
const addReminder=require('./mutation/noteMutation').addReminder
const fetchGitRepo=require('./mutation/noteMutation').fetchGitRepo


//require Query files
const Users = require("./query").User


// resolvers
exports.resolvers = {
    // Querys
    Query: {
        Users
    },
    // Mutations
    Mutation: {
        register,
        login,
        verifyEmail,
        resetpassword,
        forgotpassword,
        createLabel,
        removeLabel,
        updateLable,
        createNote,
        removeNote,
        updateNote,
        oAuth,
        gitVerify,
        imageUpload,
        archive,
        unarchive,
        trash,
        untrash,
        addReminder,
        fetchGitRepo
      
    },
}