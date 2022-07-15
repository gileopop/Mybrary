const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
});

// All books route
router.get('/', async (req, res) => {
    try {
        const authors = await Author.find({});
        const book = new Book();
        res.render('books/new', {
            authors: authors,
            book: book
        });
    } catch {
        res.redirect('books');
    }
});

// New book route
router.get('/new', (req, res) => {
    res.send('New book');
});

// Create book route 
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publicationDate: new Date(req.body.publicationDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
});

module.exports = router;