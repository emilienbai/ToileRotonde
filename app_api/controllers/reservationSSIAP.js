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
                    }else{
                        res.status(201).json({
                            "message": "You are not allowed to create reservationSSIAP for this user"
                        });
                    }
                }
            });
    }
};
