var mongoose = require('mongoose');
var Image = require('../models/image');
var fs = require('fs');
var Article = mongoose.model('Article');
var User = mongoose.model('User');

module.exports.postArticle = function (req, res) {
    if (!req.payload._id || !req.body.name || !req.body.dateIn || !req.body.dateOut || !req.body.orgaID || !req.body.orgaName) {
        console.log(req.payload._id);
        console.log(req.body);
        res.status(201).json({
            "message": "Missing payload or article element"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        var saveArticle = function (imageUrl) {
                            var article = new Article();
                            article.name = req.body.name;
                            article.dateIn = req.body.dateIn;
                            article.dateOut = req.body.dateOut;
                            article.time = req.body.time;
                            article.text = req.body.text;
                            article.imageUrl = imageUrl;
                            article.orgaID = req.body.orgaID;
                            article.orgaName = req.body.orgaName;

                            article.save(function (error) {
                                if (!error) {
                                    res.status(200).json({
                                        message: "article saved !"
                                    });
                                    //todo: send email;
                                } else {
                                    res.status(400).json({
                                        message: error
                                    });
                                }
                            });
                        };

                        var saveImage = function () {
                            if (req.files[0].mimetype.substring(0, 5) != 'image') {
                                fs.unlink(req.files[0].path);
                                saveArticle("");
                            } else {
                                Image.saveImage(req.files[0].path, function (result) {
                                    fs.unlink(req.files[0].path, function () {
                                    });
                                    if (!result) { //error
                                        saveArticle("");
                                    }
                                    else {
                                        saveArticle(result)
                                    }
                                })
                            }
                        };
                        if (req.files[0]) {
                            saveImage();
                        } else {
                            saveArticle("");
                        }
                    } else {
                        res.status(201).json({
                            "message": "You are not allowed to create an article for this user"
                        });
                    }
                }
            });
    }
};

module.exports.editArticle = function (req, res) {
    if (!req.payload._id || !req.body.article) {
        res.status(201).json({
            "message": "Missing payload or article element"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        var art = req.body.article;
                        Article
                            .findById(art._id)
                            .exec(function (err, article) {
                                    if (article.orgaID == req.payload._id || user.accountType == "admin") {
                                        if (user.accountType != "admin") {
                                            art.valid = article.valid; // non admin cannot update validity
                                        }
                                        Article
                                            .update({_id: req.body.article._id},
                                                {
                                                    $set: {
                                                        imageUrl: art.imageUrl,
                                                        text: art.text,
                                                        time: art.time,
                                                        name: art.name,
                                                        dateIn: art.dateIn,
                                                        dateOut: art.dateOut,
                                                        valid: art.valid
                                                    }
                                                }, function (error, doc) {
                                                    if (!error) {
                                                        res.status(200).json(doc);
                                                    } else {
                                                        res.status(400).json({
                                                            message: error
                                                        });
                                                    }
                                                }
                                                ,
                                                function (error, doc) {
                                                    if (!error) {
                                                        res.status(200).json(doc);
                                                    } else {
                                                        res.status(400).json({
                                                            message: error
                                                        });
                                                    }
                                                }
                                            );
                                    }
                                    else {
                                        res.status(201).json({message: "Your are not allowed to edit this article"})
                                    }
                                }
                            )
                    }
                }
            });
    }
};

module.exports.getUserArticles = function (req, res) {
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
        //Organizations can see all of their articles but not the not validated ones for the other -> /todo later for
        // other
        //Admin can see all reservations they want
        if (req.query.orgaID == req.payload._id) { // Organization try to see its own articles
            Article.find({
                'orgaID': req.query.orgaID,
                'archived': archived
            }, function (err, docs) {
                onMongoResults(err, docs);
            });//onMongoResults(err, docs));
        }
        else { //If admin account try to retrieve articles or
            User
                .findById(req.payload._id)
                .exec(function (err, user) {
                    if (!err) {
                        if (user.accountType == "admin") { //Admin authenticated
                            //Trying to get all SSIAP reservations
                            var valid = true;
                            if (req.query.valid != null) {
                                valid = req.query.valid;
                            }
                            if (req.query.orgaID == null) {
                                Article.find({
                                    'archived': archived,
                                    'valid': valid
                                }, function (err, docs) {
                                    onMongoResults(err, docs);
                                })
                            } else {    //Trying to get SSIAP reservations for defined organization
                                Article.find({
                                    'orgaID': req.query.orgaID,
                                    'archived': archived,
                                    'valid': valid
                                }, function (err, docs) {
                                    onMongoResults(err, docs);
                                })
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
}