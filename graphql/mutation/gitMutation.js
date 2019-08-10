const userModel = require("../../model/userModel");
const jwt = require('jsonwebtoken')
//const axios = require("axios");
const logger = require("../../services/logger").logger;
const axiosService = require("../../services/axios").axiosService
/**
 * @description       : create branch on repositories
 * @purpose           : To create branch on repositories
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */

exports.createBranch = async (root, args, context) => {
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
                // check if user is git user
                var gitUser = await userModel.find({
                    _id: payload.user_ID
                })
                if (gitUser.length > 0 && gitUser[0].gitVerify == true) {
                    var access_token = gitUser[0].gitToken;
                } else {
                    throw new Error("not git user")
                }
                //get sha of repository
                const shaurl = `https://api.github.com/repos/${args.gitUserName}/${args.repoName}/git/refs`

                const shaRes = await axiosService('GET', shaurl, access_token)
                console.log("sha_response==================> ", shaRes.data[0].object.sha)
                let branchurl = `https://api.github.com/repos/${args.gitUserName}/${args.repoName}/git/refs`
                const data = {
                    "ref": `refs/heads/${args.branchName}`,
                    "sha": shaRes.data[0].object.sha
                }

                const branches = await axiosService('POST', branchurl, access_token, data)

                // return branch created
                console.log("branch res==============================>", branches)
                return {
                    "message": "branch add successfully",
                    "success": true
                }
            } else {
                throw new Error("token not valid")
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
 * @description       : deleteBranch branch on repositories
 * @purpose           : To deleteBranch branch on repositories
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.deleteBranch = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // check if token is provided
        if (context.token) {
            // verify token
            var paylaod = await jwt.verify(context.token, process.env.APP_SECRET)
            if (paylaod) {
                // check if user is git user
                var gitUser = await userModel.find({
                    _id: paylaod.user_ID
                })
                if (gitUser.length > 0 && gitUser[0].gitVerify == true) {
                    var access_token = gitUser[0].gitToken;
                } else {
                    throw new Error("not git user")
                }

                // delete  branch 
                const deleteurl = `https://api.github.com/repos/${args.gitUserName}/${args.repoName}/git/refs/heads/${args.branchName}`
                const deletebranch = await axiosService('DELETE', deleteurl, access_token)
                console.log("branch res==============================>", deletebranch)
                return {
                    "message": "branch delete successfully",
                    "success": true
                }

            } else {
                throw new Error("Un Authorized")
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


/* @description       : watch  repositore
 * @purpose           : To watch repositories
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */
exports.watchRepository = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET);
            if (payload) {
                console.log(payload.user_ID)
                // check if git user
                var gitUser = await userModel.find({
                    _id: payload.user_ID
                });
                if (gitUser.length > 0 && gitUser[0].gitVerify) {
                    var access_token = gitUser[0].gitToken
                    console.log("access_token", access_token);

                    var watchurl = `https://api.github.com/user/subscriptions/${args.owner}/${args.watchRepository}`

                    await axiosService('PUT', watchurl, access_token)

                    return {
                        "message": "git repository watch successfully",
                        "success": true
                    }
                } else {
                    throw new Error("not git user")
                }
            } else {
                throw new Error("Un Auth")
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
 * @description       : unWatch  repositore
 * @purpose           : To unWatch repositories
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */
exports.unwatchRepository = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET);
            if (payload) {
                // check if git user
                var gitUser = await userModel.find({
                    _id: payload.user_ID
                });
                if (gitUser.length > 0 && gitUser[0].gitVerify) {
                    var access_token = gitUser[0].gitToken
                    var unwatchurl = `https://api.github.com/user/subscriptions/${args.owner}/${args.unwatchRepository}`
                    await axiosService('DELETE', unwatchurl, access_token)
                    return {
                        "message": "git repository unwatch successfully",
                        "success": true
                    }
                } else {
                    throw new Error("not git user")
                }
            } else {
                throw new Error("Un Auth")
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
 * @description       : star  repository
 * @purpose           : To star repository
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */

exports.starRepository = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET);
            if (payload) {
                console.log(payload.user_ID)
                // check if git user
                var gitUser = await userModel.find({
                    _id: payload.user_ID
                });
                if (gitUser.length > 0 && gitUser[0].gitVerify) {
                    var access_token = gitUser[0].gitToken
                    console.log("access_token", access_token);

                    var starurl = `https://api.github.com/user/starred/${args.owner}/${args.starRepository}`


                    await axiosService('PUT', starurl, access_token)

                    return {
                        "message": "git repository star successfully",
                        "success": true
                    }
                } else {
                    throw new Error("not git user")
                }
            } else {
                throw new Error("Un Auth")
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
 * @description       : unstar  repository
 * @purpose           : To unstar repository
 * @param {*} root    : result of previous resolve function
 * @param {*} args    : arguments for resolver funtions
 * @param {*} context    : context 
 */

exports.unstarRepository = async (root, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET);
            if (payload) {
                // check if git user
                var gitUser = await userModel.find({
                    _id: payload.user_ID
                });
                if (gitUser.length > 0 && gitUser[0].gitVerify) {
                    var access_token = gitUser[0].gitToken
                    var unstarurl = `https://api.github.com/user/starred/${args.owner}/${args.unstarRepository}`
                    await axiosService('DELETE', unstarurl, access_token)
                    return {
                        "message": "git repository unstar successfully",
                        "success": true
                    }
                } else {
                    throw new Error("not git user")
                }
            } else {
                throw new Error("Un Auth")
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