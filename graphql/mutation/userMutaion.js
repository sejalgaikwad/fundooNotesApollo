const userModel = require('../../model/userModel')
const labelModel = require('../../model/labelModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../../services/nodemailer').sendEmailFunction
const logger = require("../../services/logger").logger;

/**
 * @description : registration of user
 * @purpose : register user
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */

exports.register = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // email validation
        var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailFormat.test(args.email)) {
            throw new Error("not valid email")
        }
        // password validation
        if (args.password.length < 8) {
            throw new Error("password must have atleast 8 char")
        }
        // check if user exists
        var user = await userModel.find({
            "email": args.email
        })

        if (user.length > 0) {
            throw new Error("email already exists")
        }
        // encrypt password
        var hash = await bcrypt.hash(args.password, 10)

        var newUser = new userModel({
            "firstname": args.firstname,
            "lastname": args.lastname,
            "email": args.email,
            "password": hash,
            "verified": false
        })
        // save user 
        
        var saveUser = await newUser.save()
        var token = jwt.sign({"email": args.email}, process.env.APP_SECRET);

        var url = ` click on following link for email verification \n\n ${context.origin}/graphql?token=` + token;
        if (saveUser) {
            // send mail for email verification
            sendMail(url, args.email);
            logger.info("registration success")
            return {
                "message": "Check yours mail for email verification",
                "success": true
            };
        } else {
            return {
                "message": "registration unsucess",
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
 * @description : login user
 * @purpose : send token if user is login
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.login = async (parent, args, context, info) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // Email validation
        var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!emailFormat.test(args.email)) {
            throw new Error("Incorrect email address")
        }
        // password verification
        if (args.password.length < 8) {
          
            throw new Error("password must have atleast 8 char")
        }
        // check if user exists
        var user = await userModel.find({
            "email": args.email
        })

        console.log("user================>",user);
        if (user.length > 0) {
            if (user[0].verified === false) {
               
                throw new Error("Email not varified")
            }
            // compare password
            var valid = await bcrypt.compare(args.password, user[0].password)
            if (valid) {
                // Generate token
                var token = jwt.sign({
                    "email": user[0].email,
                    "user_ID": user[0]._id
                }, process.env.APP_SECRET);
                          
            
                var labels = await labelModel.find({  UserID: user[0]._id})
               
                // add labels to redis
                await client.set("labels" + user[0]._id, JSON.stringify(labels))
                logger.info("login success")
                return {
                    "message": "login sucess",
                    "token": token,
                    "success": true
                }
            } else {
                throw new Error("in correct password")
            }
        } else {
            throw new Error("Not registered")
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
 * @description : forgot password
 * @purpose : send URL on email to reset password
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.forgotpassword = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // check if user is registerd
        var user = await userModel.find({
            'email': args.email
        });
       
        
        if (user.length > 0) {
            // Send url with token for reseting password
            var token = jwt.sign({email: args.email  }, process.env.APP_SECRET)
            var url = ` click on url to reset password \n\n ${context.origin}/graphql?token=` + token;
            // send mail for reset password
            sendMail(url, args.email)
            // return mail send messege
            logger.info("forgot password success")
            return {
                "message": "mail send to email",
                "success": true
            }
        } else {
           
            throw new Error("Invalid user")
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
 * @description : verify Email
 * @purpose : verify email for registration
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.verifyEmail = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        console.log(context.token)
        // verify token
        let payload = await jwt.verify(context.token,process.env.APP_SECRET )
        // if token is verified set varification true
        var updateUser = await userModel.updateOne({
            "email": payload.email
        }, {
            $set: {
                verified: true
            }
        })
        if (updateUser) {
            // return success message
            logger.info("email verification success")
            return {
                "message": "email verification sucessful",
                "success": true
            }
        } else {
         
            throw new Error("Email verification not successfull")
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
 * @description : reset password
 * @purpose : reset password
 * @param {*} root : result of previous resolve function
 * @param {*} args : arguments for resolver funtions
 * @param {*} context : context 
 */
exports.resetpassword = async (parent, args, context) => {
    let result = {
        "message": "Something bad happened",
        "success": false
    }
    try {
        // check if password and confirmpassword match
        if (args.password !== args.confirmpassword) {
           
            throw new Error("password does not match")
        }
        // check if password has min 8 length
        else if (args.password.length < 8) {
            
            throw new Error("password length should be min 8")
        }
        console.log(context.token)
        // verify token
        let payload = await jwt.verify(context.token, process.env.APP_SECRET)
        //encrypt password
        var newPassword = bcrypt.hashSync(args.password, 10)
        // update password
        var updateUser = await userModel.updateOne({
            "email": payload.email
        }, {
            $set: {
                password: newPassword
            }
        })
        if (updateUser) {
            logger.info("password reset success")
            return {
                "message": "update sucessful",
                "success": true
            }
        } else {
            
            throw new Error("update unsuccessfull")
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

