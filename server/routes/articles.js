const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { protect, adminOnly } = require('../middleware/auth');

// ====================== PUBLIC ROUTES (no auth needed) ======================
router.get('/', (req, res) => {
  Article.find()
    .then(article => res.json(article))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// ====================== PROTECTED ROUTES (admin only) ======================

// ADD NEW ARTICLE
router.post('/add', protect, adminOnly, (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    article: req.body.article,
    authorname: req.body.author,
  });

  newArticle.save()
    .then(() => res.json("Added successfully"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// FIND ARTICLE BY ID (used by Edit page)
router.get('/:id', (req, res) => {
  Article.findById(req.params.id)
    .then(article => res.json(article))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// UPDATE ARTICLE
router.put('/update/:id', protect, adminOnly, (req, res) => {
  Article.findById(req.params.id)
    .then(article => {
      article.title = req.body.title;
      article.article = req.body.article;
      article.authorname = req.body.author;

      article.save()
        .then(() => res.json("Updated Successfully!"))
        .catch(err => res.status(400).json(`Error: ${err}`));
    })
    .catch(err => res.status(400).json(`Error: ${err}`));
});

// DELETE ARTICLE
router.delete('/delete/:id', protect, adminOnly, (req, res) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.json("Deleted Successfully!"))
    .catch(err => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
