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


exports.addCollaborator = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            console.log(payload.user_ID)
            var user = await userModel.find({
                "_id": payload.user_ID
            });
            
            
            if (!user.length > 0) {
                throw new Error("user not found")
            }
            var collaboratorUser = await userModel.find({
                "_id": args.collaboratorID
            })

          
            
            if (!collaboratorUser.length > 0) {
                throw new Error("no such collaborator user")
            }
            var note = await noteModel.find({
                "_id": args.noteID
            })
           
            
            if (!note.length > 0) {
                throw new Error("note not found")
            }
            var colab = await collaboratorModel.find({
                collaboratorID: args.collaboratorID,
                NoteID: args.noteID,
                UserID: payload.user_ID,
            })
          
            if (colab.length > 0) {
                throw new Error("note already colabrated")
            }
            var newColab = new collaboratorModel({
                "UserID": payload.user_ID,
                "NoteID": args.noteID,
                "collaboratorID": args.collaboratorID
            })
            var save = newColab.save()
            if (save) {
                var url = `you are collaborated successfully `
                sendMail(url)
                return {
                    "message": "user collaborated successfully",
                    "success": true
                }
            } else {
                throw new Error("colaboration unsuccessful")
            }

        }
        throw new Error("token not provided")
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
 * @description : remove collaborator
 * @purpose : to remove collaborator from notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.removeCollaborator = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            console.log(payload.user_ID)
            var user = await userModel.find({
                "_id": payload.user_ID
            });
            if (!user.length > 0) {
                throw new Error("user not found")
            }
            var collaboratorUser = await userModel.find({
                "_id": args.collaboratorID
            })
            if (!collaboratorUser.length > 0) {
                throw new Error("no such collaborator user")
            }
            var note = await noteModel.find({
                "_id": args.noteID
            })
            if (!note.length > 0) {
                throw new Error("note not found")
            }
            var colab = await collaboratorModel.findOneAndDelete({
                collaboratorID: args.collaboratorID,
                NoteID: args.noteID,
                UserID: payload.user_ID,
            })
            console.log(colab);
            if (colab) {
                var url = `you are removed from collaborator with fundoo note by `
                sendMail(url, collaboratorUser[0].email)
                return {
                    "message": "colabrator removed from note",
                    "success": true
                }

            } else {
                throw new Error("colaboration remove unsuccessful")
            }

        }
        throw new Error("token not provided")
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

