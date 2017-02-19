var express = require('express');
var router = express.Router();
var multer = require('multer');
var jwt = require('express-jwt');
var auth = jwt({
    secret: 'MY_SECRET',
    userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlReservations = require('../controllers/reservation');
var ctrlArticles = require('../controllers/article');
var ctrlAuth = require('../controllers/authentication');

router.use(multer({dest: './uploads/'}).any());

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

//reservations
router.post('/reservations', auth, ctrlReservations.postReservations);

//articles
router.post('/article', auth, ctrlArticles.postArticle);
// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
