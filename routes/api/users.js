const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../models/User');
const keys = require('../../config/keys');

router.get('/test', (req, res) => res.json({ msg: 'This is the users route' }));

// private auth route
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    handle: req.user.handle,
    email: req.user.email
  });
})

// registration route
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) return res.status(400).json({ email: 'A user has already registered with this address' });
      else {
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        })

        // newUser.save()
        //   .then(user => res.send(user))
        //   .catch(err => res.send(err))

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                const payload = { id: user.id, handle: user.handle };

                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 3600 },
                  (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                });
              })
              .catch(err => console.log(err));
          })
        })
      }
    })
});

// login route
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).json({ email: 'This user doed not exist' });

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = { id: user.id, handle: user.handle }

            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
              });
          } else return res.status(400).json({ password: 'Incorrect password' });
        })
    })
});

module.exports = router;