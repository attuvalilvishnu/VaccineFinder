const nodemailer = require('nodemailer');
const CryptoJS = require("crypto-js");

const express = require('express')

require('dotenv').config();
const client = require('twilio')();
const route = express.Router();


const decrypted = CryptoJS.AES.decrypt(process.env.DECRYPT_MAIL_PASSWORD, "xyz");
const MAIL_PASSWORD = decrypted.toString(CryptoJS.enc.Utf8);



// auth
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: MAIL_PASSWORD
    }
});


function sendWhatsAppMsg(req) {
    client.messages.create(req).then(message =>
        console.log(message.sid));
}

function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, (error, response) => {
        console.log(error);
        console.log('send', response);
    });
}


route.post('/sendMsg', (req, resp) => {
    const body = req.body;
    msgOptions = {
        from: process.env.WHATSAPP_FROM,
        body: body.msg,
    };
    body.phoneNos.forEach((phoneno) => {
        msgOptions.to = `whatsapp:+91${phoneno}`;
        sendWhatsAppMsg(msgOptions);
    });
    resp.status(200).json('Msg send');

})

route.post('/sendemail', (req, resp) => {
    const body = req.body;
    mailOptions = {
        from: process.env.user,
        to: body.toMail,
        subject: body.subject,
        text: body.text
    };
    resp.status(200).json('Email send');
    sendEmail(mailOptions);
})

module.exports = route;