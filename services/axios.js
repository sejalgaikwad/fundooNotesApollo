const axios = require('axios');

/**
 * @exports axiosService
 * @param {String} url
 * @param {method} method
 */

exports.axiosService = (method, url, access_token, data) => {
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: url,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${access_token}`
            },
            data: data
        })
            .then( (res)=> {
                resolve(res);
            })
            .catch((err)=> {
                reject(err);
            });
    });
};