// Qiniu CDN support
// Copyright: GhostChina.com

var _       = require('lodash'),
    express = require('express'),
    fs      = require('fs-extra'),
    path    = require('path'),
    util    = require('util'),
    utils   = require('../utils'),
    Promise = require('bluebird'),
    config = require('../config'),
    errors  = require('../errors'),
    baseStore   = require('./base'),
    crypto = require('crypto'),

    qiniu        = require('qiniu'),
    qiniuConfig  = config.storage,
    
    qiniuStore;

    qiniu.conf.ACCESS_KEY = qiniuConfig.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = qiniuConfig.SECRET_KEY;
    qiniu.conf.USER_AGENT = 'Ghost ' + config.ghostVersion;

var putPolicy = new qiniu.rs.PutPolicy(qiniuConfig.bucketname);

function QiniuStore () {
}

util.inherits(QiniuStore, baseStore);

QiniuStore.prototype.save = function (image) {
    var uptoken = putPolicy.token();
    var md5sum = crypto.createHash('md5'),
        ext = path.extname(image.name),
        targetDirRoot = qiniuConfig.root,
        targetFilename,
        key,
        extra = new qiniu.io.PutExtra();

    var savedpath = path.join(config.paths.imagesPath, image.name);

    return Promise.promisify(fs.copy)(image.path, savedpath).then(function(){
        return Promise.promisify(fs.readFile)(savedpath);
    }).then(function(data){
        md5 = md5sum.update(data).digest('hex');

        targetFilename = path.join(targetDirRoot, md5.replace(/^(\w{1})(\w{2})(\w+)$/, '$1/$2/$3')) + ext;
        targetFilename = targetFilename.replace(/\\/g, '/');
        key = targetFilename.replace(/^\//, '');

        return Promise.promisify(qiniu.io.put)(uptoken, key, data, extra);
    }).then(function() {
        // Remove temp file
        return Promise.promisify(fs.unlink)(savedpath);
    }).then(function () {
        // prefix + targetFilename
        var fullUrl = qiniuConfig.prefix + targetFilename;
        return fullUrl;
    }).catch(function (e) {
        errors.logError(e);
        return Promise.reject(e);
    });
};

QiniuStore.prototype.exists = function (filename) {
    return new Promise(function (resolve) {
        fs.exists(filename, function (exists) {
            resolve(exists);
        });
    });
};

QiniuStore.prototype.serve = function (){
    // For some reason send divides the max age number by 1000
    return express['static'](config.paths.imagesPath, {maxAge: utils.ONE_YEAR_MS});
};

module.exports = QiniuStore;