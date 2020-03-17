const nodemailer = require('nodemailer');
const configMail = require('./config.mail');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
    host: "mail.gmx.net",
    port: 587,
    tls: {
        ciphers:'SSLv3',
        rejectUnauthorized: false
    },
    auth: {
        user: configMail.user,
        pass: configMail.password
    },
}));

module.exports = transporter;