var mongoose = require('mongoose');
var ReservationSSIAP = mongoose.model('ReservationSSIAP');
var User = mongoose.model('User');

module.exports.postReservationSSIAP = function (req, res) {
    if (!req.payload._id || !req.body.reservation) {
        res.status(201).json({
            "message": "Missing payload or reservation"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        var resa = req.body.reservation;
                        var reservationSSIAP = new ReservationSSIAP();
                        reservationSSIAP.name = resa.name;
                        reservationSSIAP.dateIn = resa.dateIn;
                        reservationSSIAP.dateOut = resa.dateOut;
                        reservationSSIAP.timeOpening = resa.timeOpening;
                        reservationSSIAP.timeStart = resa.timeStart;
                        reservationSSIAP.duration = resa.duration;
                        reservationSSIAP.comment = resa.comment;
                        reservationSSIAP.orgaID = resa.orgaID;
                        reservationSSIAP.orgaName = resa.orgaName;

                        reservationSSIAP.save(function (error) {
                            if (!error) {
                                res.status(200).json({
                                    message: "reservation saved !"
                                });
                                //todo: send email;
                            } else {
                                res.status(400).json({
                                    message: error
                                });
                            }
                        });
                    } else {
                        res.status(201).json({
                            "message": "You are not allowed to create reservationSSIAP for this user"
                        });
                    }
                }
            });
    }
};

module.exports.getReservations = function (req, res) {
    if (!req.payload._id) {
        res.status(201).json({
            "message": "Missing payload in header"
        });
    }
    else {
        var onMongoResults = function (err, docs) {
            if (err) {
                res.status(401).json({
                    "message": err
                })
            } else {
                res.status(200).json(docs);
            }
        };

        var archived = false;
        if (req.query.archived != null) {
            archived = req.query.archived;
        }
        //Organizations can see their own reservations
        //Admin can see all reservations they want
        if (req.query.orgaID == req.payload._id) { // Organization try to see its own reservations
            ReservationSSIAP.find({
                'orgaID': req.query.orgaID,
                'archived': archived
            }, function(err, docs){onMongoResults(err, docs);});//onMongoResults(err, docs));
        } else { //If admin account try to retrieve reservations
            User
                .findById(req.payload._id)
                .exec(function (err, user) {
                    if (!err) {
                        if (user.accountType == "admin") {
                            //Trying to get all SSIAP reservations
                            if (req.query.orgaID == null) {
                                ReservationSSIAP.find({
                                    'archived': archived
                                }, function(err, docs){onMongoResults(err, docs);})
                            } else {    //Trying to get SSIAP reservations for defined organization
                                ReservationSSIAP.find({
                                    'orgaID': req.query.orgaID,
                                    'archived': archived
                                }, function(err, docs){onMongoResults(err, docs);})
                            }
                        } else {
                            res.status(201).json({
                                "message": "You are not allowed to see theses reservations"
                            })
                        }
                    }
                });
        }
    }
};
