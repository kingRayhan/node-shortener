const mongoose = require('mongoose')
require('colors')

mongoose
    .connect('mongodb://localhost:27017/node-shortener', {
        useNewUrlParser: true,
    })
    .then(c => {
        console.log('Database connected'.green)
    })
    .catch(e => {
        console.log('Can not connect to db'.red)
    })
