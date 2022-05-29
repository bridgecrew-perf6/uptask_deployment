const nodemailer = require('nodemailer')
const pug = require('pug');
const juice = require('juice')
const htmlToText = require('html-to-text')
const util = require('util')
const emailConfig = require('../config/email')

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass
    }
})

//Gerar HTML
const generarHTML = (archivo,opciones)=>{
    const html = pug.renderFile(`${__dirname}/../views/email/${archivo}.pug`,opciones);
    return juice(html)
}

exports.enviar = async(opciones)=>{

    // send mail with defined transport object
    let enviarEmail =  await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@uptask.com>', // sender address
      to: opciones.usuario.email, // list of receivers
      subject: opciones.subject, // Subject line
      text: 'hola', // plain text body
      html: generarHTML(opciones.archivo,opciones), // html body
    });
}