const jwt = require('jsonwebtoken')
const userModel = require('../../model/userModel')
const sendMail = require('../../services/nodemailer').sendEmailFunction
const axiosService = require('../../services/axios').axiosService
const logger = require('../../services/logger').logger
/**
 * @description : OAuth using github
 * @purpose : register user using github
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context
 */
exports.oAuth = async (root, args, context) => {
    try {
        // check if code is provided
        if (!context.code) {
            throw new Error('code not provided')
        }
        // url for getting accesstoken
        var tokenUrl = `${process.env.GITTOKEN}client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${context.code}`
        // axios call for getting accesstoken
        const tokenResponse = await axiosService('POST', tokenUrl)

        // access token in response
        const access_token = tokenResponse.data.access_token

        // url for getting user info
        var infoUrl = `${process.env.GITUserData}access_token=${access_token}`
        // axios call for getting user info

        const response = await axiosService('GET', infoUrl, access_token)
        console.log('response==================>', response)
        // check if user aleady present
        var existUser = await userModel.find({
            gitID: response.data.id
        })

        if (!existUser.length > 0) {
            // create new user
            var gitUser = new userModel({
                gitToken: access_token,
                gitUserName: response.data.login,
                gitID: response.data.id
            })
            // save new user
            var savedUser = await gitUser.save()
            console.log(savedUser)
            var payload = {
                gitID: response.data.id,
                user_ID: savedUser._id,
                gitUsername: response.data.login
            }
            // generate jwt token
            const token = jwt.sign(payload, process.env.APP_SECRET)

            const url = `${context.origin}/graphql?token=` + token

            // send mail
            sendMail(url)
            return {
                message: 'OAuth successfully',
                success: true
            }
        } else {
            return {
                message: 'already user',
                success: true
            }
        }
    } catch (err) {
        logger.error(err.message)
        return {
            message: err.message,
            success: false
        }
    }
}

/**
 * @description : verify gitAccount
 * @purpose : verify gitAccount
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context
 */
exports.verify = async (root, args, context) => {
    try {
        // check if token provided
        if (context.token) {
            // verify token
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
                console.log(payload)
                // check git user
                var verifyGitUser = await userModel.findByIdAndUpdate({
                    _id: payload.user_ID
                }, {
                    $set: {
                        gitVerify: true
                    }
                })
                if (verifyGitUser) {
                    var gitUser = await userModel.find({
                        _id: payload.user_ID
                    })
                    console.log(gitUser)
                    // set git verify true
                    if (gitUser[0].gitVerify === true) {
                        return {
                            message: 'Git Verify successfully',
                            success: true
                        }
                    }
                    // return git Verify unsucess
                    else {
                        return {
                            message: 'git Verify unsuccessfully',
                            success: false
                        }
                    }
                }
            } else {
                // return token not vallid
                return {
                    message: 'token not valid',
                    success: false
                }
            }
        } else {
            return {
                message: ' token not provided',
                success: false
            }
        }
    } catch (err) {
        logger.error(err.message)
        return {
            message: err,
            success: false
        }
    }
}
