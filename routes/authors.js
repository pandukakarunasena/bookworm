//make a different folder to a endpoints
//using express.Router()
const express = require('express')
const router = express.Router()
const Author = require('../models/author')


//get all authors
//mongoose give find({}) with the empty object to return all the docs
//also we can give find({something}) to search in the docs
router.get('/', async (req,res) => {
    let searchOptions = {}
    //if search input field is null or empty send all the authors
    //otherwise seacrh in the query
    //as this is a get method we can access the info by the query
    //name is declared in the input tag
    if(req.query.name !== null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    //we have declared the mongodb doc only with an name field
    try {
        const authors = await Author.find(searchOptions)
        
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }
})

//get an author
router.get('/new', (req,res) => {
    res.render('authors/new', {author: new Author()})
})

//create a new author
router.post('/', async (req,res) => {
    //create a document from the model
    const author = new Author({
        name : req.body.name
    })

    //save the document
    try {
        const newAuthor = await author.save()
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessege: 'Error creating the Author'
        })
    }

    
    
})
module.exports = router