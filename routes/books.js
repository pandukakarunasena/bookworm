const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const { fileLoader } = require('ejs')
const e = require('express')

const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']

const uploadPath = path.join('public', Book.coverImageBasePath)

const upload = multer({
    dest : uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null,true)
    } 
})

//get all books
router.get('/', async (req,res) => {
    let query = Book.find()

    if(req.query.name !== null && req.query.name !== ''){
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if(req.query.publishBefore !== null && req.query.publishBefore !== ''){
        query = query.lte('publishDate', req.query.publishBefore)
    }
    
    if(req.query.publishAfter !== null && req.query.publishAfter !== ''){
        query = query.gte('publishDate', req.query.publishAfter)
    }

    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
    })    
    }catch{
        res.redirect('/')
    }
    


})

//go to add a book page
//in here we implemented a drop down menu for authors
//so we need to take those data from the database and 
//send to populate the view
router.get('/new', async (req,res) => {
    
    try{
        const book = new Book()
        const authors = await Author.find({})
        res.render('books/new', {
            authors:authors,
            book: book
        })
    }catch{
        res.redirect('/books')
    }
    
}) 

//add a book 
router.post('/', upload.single('cover'), async (req,res)=>{

    const fileName = req.file != null ? req.file.filename: null

    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName
    })
    

    try{
        const newBook = await book.save()
        res.redirect('books')
    }catch(error){

        //remove the cover from the file system if there
        //is an error when you create the document
        if(book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        res.render('books/new', {
            book: book,
            errorMessege:'Error adding the book',
            authors: await Author.find({})
        })
    }
    
    
})

//remove the book cover from the filesystem
function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

module.exports = router
