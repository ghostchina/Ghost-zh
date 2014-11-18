// Aliyun OSS support
// Copyright: GhostChina.com

var _       = require('lodash'),
    express = require('express'),
    fs      = require('fs-extra'),
    path    = require('path'),
    util    = require('util'),
    utils   = require('../utils'),
    Promise = require('bluebird'),
    config = require('../config'),
    packageInfo   = require('../../../package.json'),
    errors  = require('../errors'),
    baseStore   = require('./base'),
    crypto = require('crypto'),

    OSS        = require('aliyun-oss'),
    ossConfig  = config.storage,
    option = {
        accessKeyId: ossConfig.ACCESS_KEY,
        accessKeySecret: ossConfig.SECRET_KEY
    };

var oss = OSS.createClient(option);

function OssStore () {
}

util.inherits(OssStore, baseStore);

OssStore.prototype.save = function (image) {
    var md5sum = crypto.createHash('md5'),
        ext = path.extname(image.name),
        targetDirRoot = ossConfig.root,
        targetFilename,
        key,
        fullUrl;

    var savedpath = path.join(config.paths.imagesPath, image.name);

    return Promise.promisify(fs.copy)(image.path, savedpath).then(function(){
        return Promise.promisify(fs.readFile)(savedpath);
    }).then(function(data){
        md5 = md5sum.update(data).digest('hex');

        targetFilename = path.join(targetDirRoot, md5.replace(/^(\w{1})(\w{2})(\w+)$/, '$1/$2/$3')) + ext;
        targetFilename = targetFilename.replace(/\\/g, '/');
        key = targetFilename.replace(/^\//, '');

        return Promise.promisify(oss.putObject, oss)({
            bucket: ossConfig.bucketname,
            object: key, 
            source: data});
    }).then(function() {
        // Remove temp file
        return Promise.promisify(fs.unlink)(savedpath);
    }).then(function () {
        // prefix + targetFilename
        var fullUrl = ossConfig.prefix + targetFilename;
        return fullUrl;
    }).catch(function (e) {
        errors.logError(e);
        return Promise.reject(e);
    });
};

OssStore.prototype.exists = function (filename) {
    return new Promise(function (resolve) {
        fs.exists(filename, function (exists) {
            resolve(exists);
        });
    });
};

OssStore.prototype.serve = function (){
    // For some reason send divides the max age number by 1000
    return express['static'](config.paths.imagesPath, {maxAge: utils.ONE_YEAR_MS});
};

module.exports = OssStore;