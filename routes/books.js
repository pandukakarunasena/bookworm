const express = require('express')
const router = express.Router()
const Book = require('../models/book')

//get all books
router.get('/', async (req,res) => {
    let searchOptions = {}

    if(req.query.name !== null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const books = await Book.find(searchOptions)
        res.render('books/index', {
        books: books,
        searchOptions: req.query
    })    
    }catch{
        res.redirect('/')
    }
    


})

//go to add a book page
router.get('/new', async (req,res) => {
    res.render('books/new', {book: new Book()})
}) 

//add a book 
router.post('/', async (req,res)=>{

    const book = new Book({
        name:req.body.name
    })

    try{
        const newBook = await book.save()
        res.redirect('/books')
    }catch{
        res.render('books/new', {
            book: book,
            errorMessege:'Can not procceed the request'
        })
    }
    
    
})

module.exports = router
