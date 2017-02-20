var mongoose = require('mongoose');

var reservationSchema = new mongoose.Schema({

        res : [{
            name: String,       //Name of the event
            isRange: Boolean,   //Multiday reservation
            dateIn: Date,       //First day of booking
            dateOut: Date,      //Last day of booking
            morning: Boolean,   //morning slot checked
            afternoon: Boolean, //afternoon slot checked
            evening: Boolean,   //evening slot checked
            audience: Boolean,  //audience in hall
        }],//newReservation()],
        orgaID: {           //Organization - User creating
            type: String,
            required: true
        },
        orgaName: String,   //Name of creator
        savedOn: {          //Date of registration
            type: Date,
            default: Date.now
        },
        archived: {            //Have been validated by an admin
            type: Boolean,
            default: false
        },
        light: Number,          //Needs concerning light
        sound: Number,          //Needs concerning sound
        comments :String        //Eventual comments if needed
});

mongoose.model('Reservation', reservationSchema);
