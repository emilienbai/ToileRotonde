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
    orgaName: String,
    archived: {
        type: Boolean,
        default: false
    },
    savedOn: {          //Date of registration
        type: Date,
        default: Date.now
    }
});

mongoose.model('ReservationSSIAP', reservationSSIAPSchema);
