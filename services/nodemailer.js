// const nodemailer = require('nodemailer');
// const logger = require('./logger').logger;
// // create mail transpoter

// exports.sendEmailFunction = (url, email) => {
//     try {
//         //
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL,
//                 pass: process.env.PASSWORD
//             },
//         });

//         // mail options
//         const mailOptions = {
//             from: 'FUNDOO MAILER',
//             to: 'sejalgaikwad24@gmail.com',//email
//             subject: 'FUNDOO-APP',
//             text: url
//         };

//         // send mail
//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 throw new Error(err);
//             }else {
//                 console.log('Email sent: ' + info.response);
//               }
//         });
//     } catch (err) {
//         logger.error(err)
//         if (err instanceof ReferenceError ||
//             err instanceof SyntaxError ||
//             err instanceof TypeError ||
//             err instanceof RangeError) {
//             return result;
//         } else {
//             result.message = err.message;
//             return result
//         }
//     }
// }


