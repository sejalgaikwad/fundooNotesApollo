const userModel = require('../../model/userModel');
const jwt = require('jsonwebtoken');
exports.imageUpload = async (root, args, context) => {
    if (context.token) {
        var payload = await jwt.verify(context.token, process.env.APP_SECRET);
    
        var updateurl = await userModel.findOneAndUpdate({
            _id: payload.user_ID
        }, {
            $set: {
                imageurl: context.request.file.location
            }
        });

        if (updateurl) {
            return {
                imageurl: context.request.file.location
            };
        }
    } else {
        return {
            imageurl: 'token not provided'
        };
    }
};