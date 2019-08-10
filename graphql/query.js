var userModel = require('../model/userModel')

var jwt = require("jsonwebtoken");

/**
  * @description       : get user
  * @param {*} root    : result of previous resolve function
  * @param {*} args    : arguments for resolver funtions
  * @param {*} context : context 
  */

exports.User = async (root, args, context) => {
    try {
        if (context.token) {
            var payload = await jwt.verify(context.token, process.env.APP_SECRET)
            if (payload) {
              var user = await userModel.find({ _id: payload.user_ID })
                return user
            }
        }
        else {
            return {
                "message": "token not provided"
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            "message": "error occured",
            "success": false
        }
    }
}
