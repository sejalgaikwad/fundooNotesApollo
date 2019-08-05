const jwt = require("jsonwebtoken");
const notesModel = require("../../model/notesModel");
const userModel = require("../../model/userModel");
const logger = require("../../services/logger").logger;

const axiosService = require("../../services/axios").axiosService;
const {
    createApolloFetch
} = require('apollo-fetch')

/**
 * @description : add notes
 * @purpose : add notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.createNote = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                // find if label name already exists for user
                var presentNote = await notesModel.find({
                    title: args.title,
                    userID: payload.userID,

                })
                console.log(presentNote)
                if (presentNote.length > 0) {
                    return {
                        "message": "title already exits",
                        "success": false
                    }
                }
                // save Notes
                console.log(payload.userID)
                var newNotes = new notesModel({
                    title: args.title,
                    userID: payload.userID,
                    labelID: args.labelID,
                    description: args.description
                })
                var saveNote = await newNotes.save()
                if (saveNote) {
                    return {
                        "message": "Note added",
                        "success": true
                    }
                } else {
                    return {
                        "message": "Note cannot be added",
                        "success": false
                    }
                }
            } else {
                return {
                    "message": "Note cannot be added",
                    "success": false
                }
            }
        } else {
            return {
                "message": "token not provided",
                "success": false
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
 * @description : remove notes
 * @purpose : remove notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.removeNote = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // check if token is provided
        if (context.token) {
            // verify token
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var removedNote = await notesModel.findOneAndDelete({
                    "_id": args.noteID
                });
                if (removedNote) {
                    // return note removed
                    return {
                        "message": "Note Removed",
                        "success": true
                    }
                } else {
                    // return unable to remove note
                    return {
                        "message": "Unable to remove Note",
                        "success": false
                    }
                }
            } else {
                // return un authorized
                return {
                    "message": "Un Auth",
                    "success": false
                }
            }
        } else {
            // return token not provided
            return {
                "message": "token not provided",
                "success": false
            }
        }
    } catch (err) {
        logger.error(err.message)
        // return error
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
 * @description : edit notes
 * @purpose : edit notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.updateNote = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // check if token is provided
        if (context.token) {
            // check if labelName is given
            if (args.title == 0 || args.description == 0) {
                return {
                    "message": "title and description are required",
                    "success": false
                }
            }
            // verify token
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                //find label of user and update
                var updateNote = await notesModel.findOneAndUpdate({
                    _id: args.noteID
                }, {
                    title: args.title,
                    description: args.description
                })
                console.log(updateNote)
                if (updateNote) {
                    // return note update success
                    return {
                        "message": "Note update success",
                        "success": true
                    }
                } else {
                    // return note connot update
                    return {
                        "message": "Note connot update",
                        "success": false
                    }
                }

            }
        } else {
            // return token not provided
            return {
                "message": "token not provided",
                "success": false
            }
        }
    } catch (err) {
        logger.error(err.message)
        // return error
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
 * @description : archive notes
 * @purpose : archive note
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.archive = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    // check if token provided
    try {
        if (context.token) {

            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {

                var note = await notesModel.find({
                    _id: args.noteID
                });
                if (note[0].archive == true) {
                    return {
                        "message": "Already Archive",
                        "success": false
                    }
                }
                if (note.length != 0) {
                    // set reminder
                    var setArchive = await notesModel.findOneAndUpdate({
                        _id: args.noteID,

                    }, {
                        $set: {
                            archive: true
                        }
                    })
                    if (setArchive) {
                        return {
                            "message": "archive successfully",
                            "success": true
                        }
                    } else {

                        throw new Error("archive  unsuccessfully")
                    }
                } else {
                    throw new Error("note not exists")
                }
            }
        } else {

            throw new Error("token not provided")
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
 * @description : unarchive notes
 * @purpose : unarchive note
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.unarchive = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    // check if token provided
    try {
        if (context.token) {

            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {

                var note = await notesModel.find({
                    _id: args.noteID
                });
                if (note[0].archive == false) {
                    return {
                        "message": "Already Unarchive",
                        "success": false
                    }
                }
                if (note.length != 0) {
                    // set reminder
                    var setArchive = await notesModel.findOneAndUpdate({
                        _id: args.noteID,

                    }, {
                        $set: {
                            archive: false
                        }
                    })
                    if (setArchive) {
                        console.log(setArchive)

                        return {
                            "message": "unarchive successfully",
                            "success": true
                        }
                    } else {

                        throw new Error("unarchive  unsuccessfully")
                    }
                } else {
                    throw new Error("note not exists")
                }
            }
        } else {

            throw new Error("token not provided")
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
 * @description : trash notes
 * @purpose : trash note
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.trash = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    // check if token provided
    try {
        if (context.token) {


            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {

                var note = await notesModel.find({
                    _id: args.noteID
                });
                if (note[0].trash == true) {
                    return {
                        "message": "Already Trash",
                        "success": false
                    }
                }
                if (note.length != 0) {
                    // set reminder
                    var setTrash = await notesModel.findOneAndUpdate({
                        _id: args.noteID,
                    }, {
                        $set: {
                            trash: true
                        }
                    })
                    if (setTrash) {
                        console.log(setTrash)
                        return {
                            "message": "trash  successfully",
                            "success": true
                        }
                    } else {

                        throw new Error("trash  unsuccessfully")
                    }
                } else {
                    throw new Error("note not exists")
                }
            }
        } else {

            throw new Error("token not provided")
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
 * @description : untrash notes
 * @purpose : untrash note
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.untrash = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    // check if token provided
    try {
        if (context.token) {

            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var note = await notesModel.find({
                    _id: args.noteID
                });
                if (note[0].trash == false) {
                    return {
                        "message": "Already Untrash",
                        "success": false
                    }
                }
                if (note.length != 0) {
                    // set reminder
                    var setTrash = await notesModel.findOneAndUpdate({
                        _id: args.noteID,
                    }, {
                        $set: {
                            trash: false
                        }
                    })
                    if (setTrash) {
                        console.log(setTrash)
                        return {
                            "message": "untrash  successfully",
                            "success": true
                        }
                    } else {
                        throw new Error("untrash  unsuccessfully")
                    }
                } else {
                    throw new Error("note not exists")
                }
            }
        } else {

            throw new Error("token not provided")
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


/*
 * @description       : add reminder to notes
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */
exports.addReminder = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    // check if token provided
    try {
        if (context.token) {
            // verify token
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            // date formate
            var reminder = new Date(args.reminder)
            console.log(reminder)
            if (reminder) {
                var note = await notesModel.find({
                    _id: args.noteID
                });
                if (note.length != 0) {
                    // set reminder
                    var setReminder = await notesModel.findOneAndUpdate({
                        _id: args.noteID,
                        UserID: payload.user_ID
                    }, {
                        $set: {
                            remainder: reminder
                        }
                    })
                    if (setReminder) {
                        console.log(setReminder)
                        // return reminder added successfully
                        return {
                            "message": "reminder added successfully",
                            "success": true
                        }
                    } else {
                        throw new Error("reminder not added successfully")
                    }
                } else {
                    throw new Error("note not exists")
                }
            }
        } else {

            throw new Error("token not provided")
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
 * @description : save git repositories name as tittle of notes
 * @purpose : To save git repositories name as tittle of notes
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.fetchGitRepo = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                var user = await userModel.find({
                    _id: payload.user_ID
                });

                // check if user is logged in using git
                if (user.length == 0) {
                    return {
                        "message": "not git user",
                        "success": false
                    }
                }
                if (user[0].gitVerify == false) {
                    // return not git user
                    return {
                        "message": "git user not verified",
                        "success": false
                    }
                } else {
                    // get git access_token of user
                    var access_token = user[0].gitToken;
                }

                let url = `${process.env.GIT_REPO}?access_token=${access_token}`
                let response = await axiosService('GET', url, access_token)

                for (var i = 0; i < response.data.length; i++) {

                    var findRepo = notesModel.find({
                        title: response.data[i].name
                    })
                    console.log("Git Repositories=========>", response.data[i].name);

                    if (!findRepo.length > 0) {
                        var noteModel = new notesModel({
                            title: response.data[i].name,
                            description: response.data[i].name,
                            userID: payload.user_ID
                        });
                        var noteSaved = await noteModel.save()
                    }
                }
                if (noteSaved) {
                    return {
                        "message": "git repository save succesfully",
                    }
                } else {
                    return {
                        "message": "git repository save succesfully",
                    }
                }

            } else {
                throw new Error("user not exists")
            }
        } else {
            return {
                "message": "token not provided"
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