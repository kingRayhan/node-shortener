const express = require('express')
const app = express()

const cookie = require('cookie-parser')
const session = require('express-session')

app.use(cookie())
app.use(
    session({
        secret: '1556780172317',
    })
)

app.get('/', (req, res) => {
    res.cookie('name', 'My Name is Rayhan', { maxAge: 2 * 60 * 1000 })
    res.send('hhh')
})
app.get('/get', (req, res) => {
    res.json(req.cookies)
})

app.listen(4545)
