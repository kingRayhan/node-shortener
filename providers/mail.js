const nodemailer = require('nodemailer')
const juice = require('juice')
const Handlebars = require('handlebars')
let transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 25,
    secure: false,
    auth: {
        user: 'apikey',
        pass:
            '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',
    },
})

const parseTemplate = (templateName, data) => {
    var source = require('fs')
        .readFileSync(__dirname + '/../mailTemplates/' + templateName + '.hbs')
        .toString()
    var template = Handlebars.compile(source)
    return juice(template(data))
}

module.exports.parseTemplate = parseTemplate

module.exports.sendMail = ({ to, subject }) => {
    return new Promise((resolve, reject) => {
        transporter
            .sendMail({
                from: '"Hot offers from Electronthemes 👻" <dd@gmail.com>', // sender address
                to, // list of receivers
                subject, // Subject line
                // html: , // html body
            })
            .then(response => {
                resolve(response)
            })
            .catch(e => reject(e))
    })
}

// promise
// array functions
// rest , spread
// module import export

module.exports.sendActivationMail = (to, data) => {
    return new Promise((resolve, reject) => {
        transporter
            .sendMail({
                from: 'node-shortener@example.com', // sender address
                to,
                subject: 'Activate your account',
                html: parseTemplate('activationMail', data),
            })
            .then(response => {
                resolve(response)
            })
            .catch(e => reject(e))
    })
}
