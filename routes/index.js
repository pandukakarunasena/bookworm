//make a different folder to a endpoints
//using express.Router()

const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('index')
})

module.exports = router