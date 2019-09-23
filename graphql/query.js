var userModel = require('../model/userModel')
var notesModel = require('../model/notesModel')
var labelModel = require('../model/labelModel')
var collaboratorModel = require('../model/collaboratorModel')
var jwt = require("jsonwebtoken");

/**
 * @description       : Search Users By Id
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.User = async (root, args) => {
    try {
        var user = await userModel.find({
            "_id": args.userID
        })

        if (user.length > 0) {
            return user;
        } else {
            return {
                "message": "no user found"
            }
        }
    } catch (err) {
        console.log("ERROR", err);
        return {
            "message": "something went wrong"
        }
    }
}

/**
 * @description       : Search Users By Email
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.searchUser = async (root, args) => {
    try {
        var user = await userModel.find({
            "email": {
                $regex: args.email,
                $options: 'i'
            },
        })

        if (user.length > 0) {
            return user;
        } else {
            return {
                "message": "no user found"
            }
        }
    } catch (err) {
        console.log("ERROR", err);
        return {
            "message": "something went wrong"
        }
    }
}


/**
 * @description       :  Search Label By ID
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.label = async (root, args, context) => {

    try {
        var label = await labelModel.find({
            "_id": args.labelID
        })

        if (label.length > 0) {
            return label;
        } else {
            return {
                "message": "no user found"
            }
        }
    } catch (err) {
        console.log("ERROR", err);
        return {
            "message": "something went wrong"
        }
    }
}


/**
 * @description       : Search Notes By Title
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 *@param {*} context : context 
 */

exports.searchNotesByTitle = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var notes = await notesModel.find({
                    title: {
                        $regex: args.title,
                        $options: 'i'
                    },
                    UserID: payload.user_ID
                })
                console.log(notes)
                return notes
            }
        } else {
            return {
                "message": "token not provided"
            }
        }
    } catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}

/**
 * @description       : Search Notes By Description
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.searchNotesByDescription = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var notes = await notesModel.find({
                    'description': {
                        $regex: args.description,
                        $options: 'i'
                    },
                    UserID: payload.user_ID
                })
                return notes
            }
        } else {
            return {
                "message": "token not provided"
            }
        }
    } catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}

/**
 * @description       : Search collaborator Note
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.collaboratedNote = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var collaboratedNote = await collaboratorModel.find({
                    NoteID: args.NoteID,
                    UserID: payload.user_ID
                })
                console.log("collaborate Note Count", collaboratedNote.length);
                return collaboratedNote
            }

        } else {
            return {
                "message": "token not provided"
            }
        }
    } catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}