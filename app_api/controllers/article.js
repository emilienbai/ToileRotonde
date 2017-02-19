var mongoose = require('mongoose');
var Image = require('../models/image');
var fs = require('fs');
var Article = mongoose.model('Article');
var User = mongoose.model('User');

module.exports.postArticle = function (req, res) {
    console.log(req);
    if (!req.payload._id    ||
        !req.body.name      ||
        !req.body.dateIn    ||
        !req.body.dateOut   ||
        !req.body.orgaID    ||
        !req.body.orgaName) {
        res.status(201).json({
            "message": "Missing payload or article element"
        });
    } else {
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                if (!err) {
                    if (user._id == req.payload._id || user.accountType == "admin") {
                        console.log("user is fine");

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