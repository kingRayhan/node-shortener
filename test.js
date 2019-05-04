const { parseTemplate } = require('./providers/mail')

const parse = parseTemplate('activationMail', {
    btnUrl: `http://localhost:3000/activate/0d0de708-2aec-4232-8a51-c6fef50c59751556978606246`,
})

console.log(parse)
