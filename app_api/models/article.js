var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    name: String,
    dateIn: Date,
    dateOut: Date,
    time: String,
    text: String,
    imageUrl: String,
    orgaID: {           //Organization - User creating
        type: String,
        required: true
    },
    orgaName: String,   //Name of creator
    savedOn: {          //Date of registration
        type: Date,
        default: Date.now
    },
    valid: {            //Have been validated by an admin
        type: Boolean,
        default: false
    }
});

mongoose.model('Article', articleSchema);
