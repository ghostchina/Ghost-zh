// Upyun CDN support
// Copyright: GhostChina.com

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
    upyunConfig = config.storage,
    UPYun   = require('upyun'),
    upyun   = new UPYun(upyunConfig.bucketname, upyunConfig.username, upyunConfig.password, 'v0');

function UpyunStore () {
}

util.inherits(UpyunStore, baseStore);

UpyunStore.prototype.save = function (image) {
    var md5sum = crypto.createHash('md5'),
        ext = path.extname(image.name),
        targetDirRoot = upyunConfig.root,
        targetFilename;

    var savedpath = path.join(config.paths.imagesPath, image.name);

    return Promise.promisify(fs.copy)(image.path, savedpath).then(function(){
        return Promise.promisify(fs.readFile)(savedpath);
    }).then(function(data){
        md5 = md5sum.update(data).digest('hex');

        targetFilename = path.join(targetDirRoot, md5.replace(/^(\w{1})(\w{2})(\w+)$/, '$1/$2/$3')) + ext;
        targetFilename = targetFilename.replace(/\\/g, '/');

        return Promise.promisify(upyun.uploadFile, upyun)(targetFilename, data, '', false, {});
    }).then(function(response) {
        // Remove temp file
        return Promise.promisify(fs.unlink)(savedpath);
    }).then(function () {
        // prefix + upyunFilename
        var fullUrl = upyunConfig.prefix + targetFilename;
        return fullUrl;
    }).catch(function (e) {
        errors.logError(e);
        return Promise.reject(e);
    });
};

UpyunStore.prototype.exists = function (filename) {
    return new Promise(function (resolve) {
        fs.exists(filename, function (exists) {
            resolve(exists);
        });
    });
};

UpyunStore.prototype.serve = function (){
    // For some reason send divides the max age number by 1000
    return express['static'](config.paths.imagesPath, {maxAge: utils.ONE_YEAR_MS});
};

module.exports = UpyunStore;