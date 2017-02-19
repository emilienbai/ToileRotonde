var mongoose = require('mongoose');
var Reservation = mongoose.model('Reservation');
var User = mongoose.model('User');

module.exports.postReservations = function (req, res) {
    if (!req.payload._id || !req.body.reservations) {
        res.status(201).json({
            "message": "Missing payload, playlistID or comment"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    console.log(user);
                    console.log(req.payload._id);
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        console.log("user is fine");

                        var reservation = new Reservation();
                        reservation.res = req.body.reservations.res;
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
                    }else{
                        res.status(201).json({
                            "message": "You are not allowed to create reservations for this user"
                        });
                    }
                }
            });
    }
};
