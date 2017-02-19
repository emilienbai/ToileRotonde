var mongoose = require('mongoose');

var reservationSSIAPSchema = new mongoose.Schema({
    name:String,
    dateIn: Date,
    dateOut: Date,
    timeOpening: String,
    timeStart: String,
    duration: String,
    comment: String,
    orgaID: String,
    orgaName: String
});

mongoose.model('ReservationSSIAP', reservationSSIAPSchema);
