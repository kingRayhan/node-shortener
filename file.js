const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const PORT = 8000
app.use('/form', express.static(__dirname + '/index.html'))

// default options
app.use(fileUpload())

app.post('/upload', function(req, res) {
    req.files.sampleFile.mv(__dirname + '/uploads/rayhan.sdsds')
})

app.listen(PORT, function() {
    console.log('Express server listening on port ', PORT) // eslint-disable-line
})
