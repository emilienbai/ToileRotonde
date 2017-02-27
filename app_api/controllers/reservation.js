var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');
var User = mongoose.model('User');

module.exports.postReservations = function (req, res) {
    if (!req.payload._id || !req.body.reservations) {
        res.status(201).json({
            "message": "Missing payload or reservation"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        var reservation = new Reservation();
                        reservation.res = req.body.reservations.res;
                        reservation.orgaID = req.body.reservations.orgaID;
                        reservation.orgaName = req.body.reservations.orgaName;
                        reservation.light = req.body.reservations.light;
                        reservation.sound = req.body.reservations.sound;
                        reservation.comments = req.body.reservations.comments;

                        reservation.save(function (error) {
                            if (!error) {
                                res.status(200).json({
                                    message: "reservations saved !"
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
                            "message": "You are not allowed to create reservations for this user"
                        });
                    }
                }
            });
    }
};

module.exports.editReservations = function (req, res) {
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

                        Reservation
                            .findById(resa._id)
                            .exec(function (err, reser) {
                                if (reser.orgaID == req.payload._id || user.accountType == "admin") {
                                    if (user.accountType != "admin") {
                                        resa.archived = reser.valid; // non admin cannot update archived status
                                    }
                                    Reservation
                                        .update({_id: resa._id},
                                            {
                                                $set: {
                                                    res: resa.res,
                                                    archived: resa.archived,
                                                    light: resa.light,
                                                    sound: resa.sound,
                                                    comments: resa.comments
                                                }
                                            }, function (error, doc) {
                                                if (!error) {
                                                    res.status(200).json(doc);
                                                } else {
                                                    res.status(400).json({
                                                        message: error
                                                    });
                                                }
                                            })
                                }
                            });
                    } else {
                        res.status(201).json({
                            "message": "You are not allowed to edit this reservation"
                        });
                    }
                }
            });
    }
};

module.exports.getUserReservations = function (req, res) {
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
        if (req.query.archived) {
            archived = req.query.archived;
        }
        //Organizations can see all of their reservations
        //Admin can see all reservations they want
        if (req.query.orgaID == req.payload._id) { // Organization try to see its own reservations
            Reservation.find({
                'orgaID': req.query.orgaID,
                'archived': archived
            }, function (err, docs) {
                onMongoResults(err, docs);
            });
        } else if (req.query.orgaID == null) {//trying to see all reservations
            User
                .findById(req.payload._id)
                .exec(function (err, user) {
                    if (!err) {
                        if (user._id == req.payload._id || user.accountType == "admin") {
                            console.log("User is admin");
                            Reservation.find({
                                'archived': archived
                            }, function (err, docs) {
                                onMongoResults(err, docs);
                            });
                        }
                    }
                });
        }
    }
};

