//load the .env files if the environment is not production
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const mongoose = require('mongoose')

const App = express()

//make folders for the view 
App.set('view engine', 'ejs')
App.set('views', __dirname + '/views')
App.set('layout', 'layouts/layout')

//establish the connection to mongoDB
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
//connect to the database
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoose'))

//use the middlewares
App.use(expressLayouts)
//where our styles js files would be
App.use(express.static('public'))

//call the endpoints as middlewares from the router file
App.use('/', indexRouter)

App.listen(process.env.PORT || 3000)