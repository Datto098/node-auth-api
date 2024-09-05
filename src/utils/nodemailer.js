const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../configs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});

module.exports = transporter;
