/*Save user profile pictures on a cloud*/
var cloudinary = require('cloudinary');
var config = require('../config.json')

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});


module.exports.saveImage = function (source, callback) {
    cloudinary.uploader.upload(source, function(result) {
        if(!result.secure_url){ //error while uploading
            callback(null);
        }
        else { //everything went fine
            callback(result.secure_url);
        }
    });
};
