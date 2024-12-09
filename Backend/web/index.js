const express = require('express')
const mongoose = require('mongoose')
const api = require('./routes/index')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.use('/api', api)
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/bazaar')
        console.log('Database connected')
    }
    catch(e){
        console.log('Error database connection \n', e)
    }
    console.log(`listening on port ${port}!`)
})