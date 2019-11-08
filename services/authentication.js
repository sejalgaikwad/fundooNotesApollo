const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

exports.authentication = async (token) => {
    return new Promise((resolve, reject) => {
        try {
            var payload =  jwt.verify(token, process.env.APP_SECRET);
            var user =  userModel.findById({ _id: payload.user_ID });
            if (user) {
                resolve(payload);
            }
            else {
                reject('user not found');
            }
        }
        catch (err) {
            console.log(err);
            reject('un auth');
        }
    });
};