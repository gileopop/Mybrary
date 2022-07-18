const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

// All books route
router.get('/', async (req, res) => {
    res.send('All books');
});

// New book route
router.get('/new', (req, res) => {
    renderNewPage(res, new Book());
});

// Create book route 
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publicationDate: new Date(req.body.publicationDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    });

    try {
        const newBook = await book.save();
        // res.redirect(`books/${newBook.id}`);
        res.redirect('books');
    } catch {
        renderNewPage(res, book, true);
    }
});

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (hasError) params.errorMessage = 'Error creating book.';
        res.render('books/new', params);
    } catch {
        res.redirect('/ books');
    }
}


module.exports = router;