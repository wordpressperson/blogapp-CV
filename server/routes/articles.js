const express = require('express');
const router = express.Router();
const Article = require('../models/Article')

//FETCHING ALL ARTICLES
router.get('/', (req, res) => {
    Article.find()
        .then(article => res.json(article))
        .catch(err => res.status(400).json(`Error: ${err}`))
})

//ADDING A NEW ARTICLE
router.post('/add', (req, res) => {
    const newArticle=new Article({
        title: req.body.title,
        article: req.body.article,
        authorname: req.body.author,
    })

    newArticle.save().then(() => res.json("Added successfully"))
    .catch((err) => res.status(400).json(`Error: ${err}`))
})

//FINDING AN ARTICLE BY ID
router.get('/:id', (req, res) => {
    Article.findById(req.params.id).then(article => res.json(article))
        .catch((err) => res.status(400).json(`Error: ${err}`))
})

//UPDATE BY ID
router.put('/update/:id', (req, res) => {
    Article.findById(req.params.id).then(article => {
        article.title= req.body.title,
        article.article= req.body.article,
        article.authorname= req.body.author

        article.save().then(() => res.json("Updated Successfully!"))
        .catch((err) => res.status(400).json(`Error: ${err}`))
    })
})

//DELETE BY ID
router.delete('/delete/:id', (req, res) => { 
    Article.findByIdAndDelete(req.params.id)
        .then(() => res.json("Deleted Successfully!"))
        .catch((err) => res.status(400).json(`Error: ${err}`))
}) 

module.exports = router;