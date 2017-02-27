var mongoose = require('mongoose');
var Slot = mongoose.model('Slot');
var User = mongoose.model('User');

module.exports.postSlots = function (req, res) {
    if (!req.payload._id || !req.body.slots) {
        res.status(201).json({
            "message": "Missing payload or slots element"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user.accountType == "admin") {
                        console.log(req.body.slots);
                        Slot.insertMany(req.body.slots, function (error, docs) {
                            if (error) {
                                res.status(401).json({
                                    "message": error
                                })
                            } else {
                                res.status(200).json(docs)
                            }
                        })
                    } else {
                        res.status(403).json({
                            "message": "You are not allowed to add slots to the planning"
                        })
                    }
                }
            });
    }
};

module.exports.getSlots = function(req, res) {
    if(!req.query.from || !req.query.to){
        res.status(201).json({
            message: "Req 'from' or 'to' parameter"
        });
        return;
    }

    var from = req.query.from.split('-');
    var dateFrom = new Date(from[0], from[1], 1);
    var to = req.query.to.split('-');
    var dateTo = new Date(to[0], to[1], 1)

    var onMongoResults = function (err, docs) {
        console.log("onmongoresult");
        if (err) {
            res.status(401).json({
                "message": err
            })
        } else {
            res.status(200).json(docs);
        }
    };
    if (req.query.OrgaID){ //specified orga
        Slot.find({
                orgaID: req.query.orgaID,
                date: { $gt: dateFrom, $lt: dateTo}
            },function(err, docs){
                onMongoResults(err, docs);
        }
            )
    } else { //all orga
        Slot.find({
                date: { $gt: dateFrom, $lt: dateTo}
            },
            function(err, docs){
                onMongoResults(err, docs);
            })
    }
}

