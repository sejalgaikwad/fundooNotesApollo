const jwt = require('jsonwebtoken')
const labelModel = require('../../model/labelModel')
const logger = require('../../services/logger').logger
/**
 * @description : add labels
 * @purpose : add labels
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context
 */
exports.createLabel = async (root, args, context) => {
    const result = {
        message: 'Something bad happened',
        success: false
    }
    try {
        // check if token is provided
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                if (args.labelName.length < 3) {
                    throw new Error('label name should be have length of atleast 3')
                }
                console.log(payload.userID)
                // find if label name already exists for user
                var presentlabel = await labelModel.find({
                    labelName: args.labelName,
                    UserID: payload.userID
                })
                if (presentlabel.length > 0) {
                    throw new Error('label already exits')
                }
                // save label
                var newlabel = new labelModel({
                    labelName: args.labelName,
                    UserID: payload.userID
                })
                var savelabel = await newlabel.save()
                if (savelabel) {
                    return {
                        message: 'label added',
                        success: true
                    }
                } else {
                    // return label connot add
                    throw new Error('label cannot be added')
                }
            } else {
                // return label not added
                throw new Error('label cannot be added')
            }
        } else {
            // return token not provided
            throw new Error('token not provided')
        }
    }
    // catch if error occures
    catch (err) {
        logger.error(err.message)
        if (err instanceof ReferenceError ||
            err instanceof SyntaxError ||
            err instanceof TypeError ||
            err instanceof RangeError) {
            return result
        } else {
            result.message = err.message
            return result
        }
    }
}

/**
 * @description : remove label
 * @purpose : remove label
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context
 */
exports.removeLabel = async (root, args, context) => {
    const result = {
        message: 'Something bad happened',
        success: false
    }
    try {
        // check if token is provided
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                console.log(payload)
                // find label and delete
                var removedlabel = await labelModel.findOneAndDelete({
                    userID: payload.userID,
                    _id: args.labelID
                })
                if (removedlabel) {
                    return {
                        message: 'Label Removed',
                        success: true
                    }
                } else {
                    throw new Error('Unable to remove label')
                }
            } else {
                throw new Error('Un Auth')
            }
        } else {
            throw new Error('token not provideds')
        }
    } catch (err) {
        logger.error(err.message)
        // return error
        if (err instanceof ReferenceError ||
            err instanceof SyntaxError ||
            err instanceof TypeError ||
            err instanceof RangeError) {
            return result
        } else {
            result.message = err.message
            return result
        }
    }
}

/**
 * @description : update label
 * @purpose : update label
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context
 */
exports.updateLabel = async (root, args, context) => {
    const result = {
        message: 'Something bad happened',
        success: false
    }
    try {
        if (context.token) {
            // check if labelName is given
            if (args.labelName === 0 || args.newlabelName === 0) {
                throw new Error('label name require')
            }
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                // find label of user and update
                var updateLabel = await labelModel.findOneAndUpdate({
                    userID: payload.userID,
                    _id: args.labelID
                }, {
                    $set: {
                        labelName: args.newlabelName
                    }
                })
                console.log(updateLabel)
                if (updateLabel) {
                    return {
                        message: 'label update successfully',
                        success: true
                    }
                } else {
                    throw new Error('label connot update')
                }
            }
        } else {
            throw new Error('token not provided')
        }
    } catch (err) {
        logger.error(err.message)
        // return error
        if (err instanceof ReferenceError ||
            err instanceof SyntaxError ||
            err instanceof TypeError ||
            err instanceof RangeError) {
            return result
        } else {
            result.message = err.message
            return result
        }
    }
}
