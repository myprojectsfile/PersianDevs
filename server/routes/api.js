var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

/* GET api listing. */
router.get('/', (req, res) => {
  res.send(req.user);
});

// Get all posts
router.get('/posts', (req, res) => {
  // Get posts from the mock api
  // This should ideally be replaced with a service that connects to MongoDB
  axios.get(`${API}/posts`)
    .then(posts => {
      res.status(200).json(posts.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.post('/register', function (req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function (err, account) {
    if (err) {
      res.status(400).send('خطا در فرآیند ثبت نام' + '\n' + 'پیام خطا:' + err);
    }

    passport.authenticate('local')(req, res, function () {
      res.status(200).send('ثبت نام با موفقیت انجام شد');
    });
  });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
  res.status(200).send('ورود با موفقیت انجام');
});

module.exports = router;