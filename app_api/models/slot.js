var mongoose = require('mongoose');

var slotSchema = new mongoose.Schema({
    orgaID: {
        type: String,
        required: true
    },
    orgaName: String,
    date: Date,
    period: String,
    audience: Boolean
});

mongoose.model('Slot', slotSchema);
