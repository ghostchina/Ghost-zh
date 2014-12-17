// # ACE-Storage CDN support
// GhostChina.com

var _       = require('lodash'),
    express = require('express'),
    fs      = require('fs-extra'),
    path    = require('path'),
    util    = require('util'),
    utils   = require('../utils'),
    Promise = require('bluebird'),
    errors  = require('../errors'),
    config  = require('../config'),
    baseStore   = require('./base'),
    crypto  = require('crypto');
    storageConfig = config.storage,
    storageConfig.root = '/',
    storageConfig.bucketname = storageConfig.bucketname || 'default';

var aceStorage = new global.ACESDK.STORAGE(storageConfig.bucketname);


function AceStorage () {
}

util.inherits(AceStorage, baseStore);

AceStorage.prototype.save = function (image) {
    var md5sum = crypto.createHash('md5'),
        ext = path.extname(image.name),
        targetDirRoot = storageConfig.root,
        targetFilename;

    var savedpath = path.join(config.paths.imagesPath, image.name);

    return Promise.promisify(fs.copy)(image.path, savedpath).then(function(){
        return Promise.promisify(fs.readFile)(savedpath);
    }).then(function(data){
        md5 = md5sum.update(data).digest('hex');
        targetFilename = path.join(targetDirRoot, md5.replace(/^(\w{1})(\w{2})(\w+)$/, '$1/$2/$3')) + ext;
        targetFilename = targetFilename.replace(/\\/g, '/');

        return new Promise(function(resolve, reject){
            aceStorage.putObject({
                Key: targetFilename.replace(/^\/(.*)/g, '$1'),
                Body: data,
                Expires: 60
            },
            function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });

    }).then(function(response) {
        // Remove temp file
        return Promise.promisify(fs.unlink)(savedpath);
    }).then(function () {
        // The src for the image must be in URI format, not a file system path, which in Windows uses \
        // For local file system storage can use relative path so add a slash
        var fullUrl = (config.paths.subdir + '/' + config.paths.imagesRelPath + '/' +
            targetFilename).replace(new RegExp('\\' + path.sep, 'g'), '/').replace(new RegExp('/+', 'g'), '/');
        return fullUrl;
    }).catch(function (e) {
        return Promise.reject(e);
    });
};

AceStorage.prototype.exists = function (filename) {
    return new Promise(function (resolve, reject) {
        aceStorage.getObject({
                Key: filename.replace(/^\/(.*)/g, '$1'),
            },
            function (err, data) {
            if (err) {
                return reject(err);
            }

            return resolve(true);
        });
    });
};

AceStorage.prototype.serve = function (){

    return function(req, res){
        
        aceStorage.getObject({
            Key: req.path.replace(/^\/(.*)/g, '$1'),
            },
            function (err, data) {
            if (err) {
                return errors.logError(err);
            }
            
            res.send(new Buffer(data.Body));
        });
    };
};

module.exports = AceStorage;