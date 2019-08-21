const userModel = require('../../model/userModel')
const noteModel = require('../../model/notesModel');
const collaboratorModel = require('../../model/collaboratorModel')
const sendMail = require('../../services/nodemailer').sendEmailFunction
const logger = require("../../services/logger").logger;
const jwt = require('jsonwebtoken');

/**
 * @description : add collaborator
 * @purpose : to add collaborator in notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.addCollaborator = async (root, args, context) => {

    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)

            var user = await userModel.find({
                _id: payload.user_ID
            })
            if (!user.length > 0) {
                return {
                    "message": "User not found"
                }
            }

            var note = await noteModel.find({
                _id: args.noteID
            })
            if (!note.length > 0) {
                return {
                    "message": "Note not found"
                }
            }

            var collaboratorUser = await collaboratorModel.find({
                _id: args.collaboratorID
            })

            if (collaboratorUser.length > 0) {
                return {
                    "message": "This user is already collaboratored"
                }
            } else {
                if (!collaboratorUser)({
                    "message": "not a fundoo user"
                })
                var url = "you have been collaborator successfully"
                sendMail(url);

                var newCollaborator = new collaboratorModel({
                    UserID: payload.user_ID,
                    NoteID: args.noteID,
                    collaboratorID: args.collaboratorID
                })
                let save = await newCollaborator.save()
                if (!save) {
                    return {
                        "message": err
                    }
                }
                return {
                    "message": "collaborator successfully"
                }
            }
        }
    } catch (err) {
        logger.error(err.message)
        if (err instanceof ReferenceError ||
            err instanceof SyntaxError ||
            err instanceof TypeError ||
            err instanceof RangeError) {
            return result;
        } else {
            result.message = err.message;
            return result
        }
    }
}


/**
 * @description       : remove collaborator
 * @purpose           : to remove collaborator from notes
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.removeCollaborator = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)

            var user = await userModel.find({
                _id: payload.user_ID
            })
            var user = await userModel.find({
                _id: payload.user_ID
            })
            if (!user.length > 0) {
                return {
                    "message": "user not found"
                }
            }
            var note = await noteModel.find({
                _id: args.noteID
            })
            if (!note.length > 0) {
                return {
                    "message": "note not found"
                }
            }
            var colab = await collaboratorModel.findOneAndRemove({
                collaboratorID: args.collaboratorID
            })
            if (colab) {
                return {
                    "message": "collaborator successfully deleted"
                }
            } else {
                return {
                    "message": "error while deleting the colaborator"
                }
            }
        }
    } catch (err) {
        logger.error(err.message)
        if (err instanceof ReferenceError ||
            err instanceof SyntaxError ||
            err instanceof TypeError ||
            err instanceof RangeError) {
            return result;
        } else {
            result.message = err.message;
            return result
        }
    }
}