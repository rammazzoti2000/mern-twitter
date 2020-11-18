const express = require('express');
const router = express.Router();
const passport = require('passport');

const Tweet = require('../models/Tweet');
const validateTweetInput = require('../../validation/tweets');

// all tweets route
router.get('/', (req, res) =>{
  Tweet.find()
    .sort({ date: -1 })
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({ notweetsfound: 'No tweets found' }));
});

// a single'users tweets route
router.get('/user/:user_id', (req, res) => {
  Tweet.find({ user: req.params.user_id })
    .then(tweets => res.json(tweets))
    .catch(err => res.status(404).json({ notweetsfound: 'No tweets found from that user' }));
});

// individual tweets route
router.get('/:id', (req, res) => {
  Tweet.findById(req.params.id)
    .then(tweet => res.json(tweet))
    .catch(err => res.status(404).json({ notweetfound: 'No tweet found with that id' }));
});

// protected route for a user to post a tweet
router.post('/',
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const { errors, isValid } = validateTweetInput(req.body);

    if (!isValid) return res.status(400).json(errors);

    const newTweet = new Tweet({
      text: req.body.text,
      user: req.user.id
    });

    newTweet.save().then(tweet => res.json(tweet));
  }
);

module.exports = router;