const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")

exports.authentication = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            var payload = await jwt.verify(token, process.env.APP_SECRET)
            var user = await userModel.findById({ _id: payload.user_ID })
            if (user) {
                resolve(payload)
            }
            else {
                reject("user not found")
            }
        }
        catch (err) {
            console.log(err)
            reject("un auth")
        }
    })
}