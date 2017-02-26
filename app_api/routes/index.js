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
var ctrlReservationSSIAP = require('../controllers/reservationSSIAP');
var ctrlArticles = require('../controllers/article');
var ctrlAuth = require('../controllers/authentication');
var ctrlSlot = require('../controllers/slot');

router.use(multer({dest: './uploads/'}).any());

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

//reservations
router.post('/reservations', auth, ctrlReservations.postReservations);
router.get('/reservations', auth, ctrlReservations.getUserReservations);

//reservationSSIAP
router.post('/reservationSSIAP', auth, ctrlReservationSSIAP.postReservationSSIAP);
router.get('/reservationSSIAP', auth, ctrlReservationSSIAP.getReservations);
router.put('/reservationSSIAP', auth, ctrlReservationSSIAP.archiveReservation);

//articles
router.post('/article', auth, ctrlArticles.postArticle);
router.get('/article', auth, ctrlArticles.getUserArticles);
router.put('/article', auth, ctrlArticles.editArticle);

//Slots
router.post('/slot', auth, ctrlSlot.postSlots);
router.get('/slot', ctrlSlot.getSlots);
// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;
