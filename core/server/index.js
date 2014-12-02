// Module dependencies
var express     = require('express'),
    hbs         = require('express-hbs'),
    compress    = require('compression'),
    fs          = require('fs'),
    uuid        = require('node-uuid'),
    _           = require('lodash'),
    Promise     = require('bluebird'),

    api         = require('./api'),
    config      = require('./config'),
    errors      = require('./errors'),
    helpers     = require('./helpers'),
    mailer      = require('./mail'),
    middleware  = require('./middleware'),
    migrations  = require('./data/migration'),
    models      = require('./models'),
    permissions = require('./permissions'),
    apps        = require('./apps'),
    sitemap     = require('./data/sitemap'),
    GhostServer = require('./ghost-server'),

// Variables
    dbHash;

function doFirstRun() {
    var firstRunMessage = [
        '欢迎使用 Ghost 博客系统。',
        '当前博客的运行环境为 <strong>',
        process.env.NODE_ENV,
        '</strong>。',

        '博客网址被设置为',
        '<strong>' + config.url + '</strong>.',
        '详情请参考 <a href="http://www.ghostchina.com/" target="_blank">Ghost中文文档</a>。'
    ];

    return api.notifications.add({notifications: [{
        type: 'info',
        message: firstRunMessage.join(' ')
    }]}, {context: {internal: true}});
}

function initDbHashAndFirstRun() {
    return api.settings.read({key: 'dbHash', context: {internal: true}}).then(function (response) {
        var hash = response.settings[0].value,
            initHash;

        dbHash = hash;

        if (dbHash === null) {
            initHash = uuid.v4();
            return api.settings.edit({settings: [{key: 'dbHash', value: initHash}]}, {context: {internal: true}})
                .then(function (response) {
                    dbHash = response.settings[0].value;
                    return dbHash;
                }).then(doFirstRun);
        }

        return dbHash;
    });
}

// Checks for the existence of the "built" javascript files from grunt concat.
// Returns a promise that will be resolved if all files exist or rejected if
// any are missing.
function builtFilesExist() {
    var deferreds = [],
        location = config.paths.builtScriptPath,

        fileNames = process.env.NODE_ENV === 'production' ?
            helpers.scriptFiles.production : helpers.scriptFiles.development;

    function checkExist(fileName) {
        var errorMessage = 'Javascript files have not been built.',
            errorHelp = '\nPlease read the getting started instructions at:' +
                        '\nhttps://github.com/TryGhost/Ghost#getting-started';

        return new Promise(function (resolve, reject) {
            fs.exists(fileName, function (exists) {
                if (exists) {
                    resolve(true);
                } else {
                    var err = new Error(errorMessage);

                    err.help = errorHelp;
                    reject(err);
                }
            });
        });
    }

    fileNames.forEach(function (fileName) {
        deferreds.push(checkExist(location + fileName));
    });

    return Promise.all(deferreds);
}

// This is run after every initialization is done, right before starting server.
// Its main purpose is to move adding notifications here, so none of the submodules
// should need to include api, which previously resulted in circular dependencies.
// This is also a "one central repository" of adding startup notifications in case
// in the future apps will want to hook into here
function initNotifications() {
    if (mailer.state && mailer.state.usingDirect) {
        api.notifications.add({notifications: [{
            type: 'info',
            message: [
                'Ghost 将尝试直接发送邮件。',
                '建议为 Ghost 系统设置一个邮件服务。',
                '请参考 <a href=\'http://www.ghostchina.com/mail-configuration-on-self-hosted-version-of-ghost/\' target=\'_blank\'>Ghost 邮件系统设置详解</a> 了解更多信息'
            ].join(' ')
        }]}, {context: {internal: true}});
    }
    if (mailer.state && mailer.state.emailDisabled) {
        api.notifications.add({notifications: [{
            type: 'warn',
            message: [
                'Ghost 目前无法发送邮件。',
                '请参考 <a href=\'http://www.ghostchina.com/mail-configuration-on-self-hosted-version-of-ghost/\' target=\'_blank\'>Ghost 邮件系统设置详解</a> 了解更多信息'
            ].join(' ')
        }]}, {context: {internal: true}});
    }
}

// ## Initializes the ghost application.
// Sets up the express server instance.
// Instantiates the ghost singleton, helpers, routes, middleware, and apps.
// Finally it returns an instance of GhostServer
function init(options) {
    // Get reference to an express app instance.
    var blogApp = express(),
        adminApp = express();

    // ### Initialisation
    // The server and its dependencies require a populated config
    // It returns a promise that is resolved when the application
    // has finished starting up.

    // Load our config.js file from the local file system.
    return config.load(options.config).then(function () {
        return config.checkDeprecated();
    }).then(function () {
        // Make sure javascript files have been built via grunt concat
        return builtFilesExist();
    }).then(function () {
        // Initialise the models
        return models.init();
    }).then(function () {
        // Initialize migrations
        return migrations.init();
    }).then(function () {
        // Populate any missing default settings
        return models.Settings.populateDefaults();
    }).then(function () {
        // Initialize the settings cache
        return api.init();
    }).then(function () {
        // Initialize the permissions actions and objects
        // NOTE: Must be done before initDbHashAndFirstRun calls
        return permissions.init();
    }).then(function () {
        return Promise.join(
            // Check for or initialise a dbHash.
            initDbHashAndFirstRun(),
            // Initialize mail
            mailer.init(),
            // Initialize apps
            apps.init(),
            // Initialize sitemaps
            sitemap.init()
        );
    }).then(function () {
        var adminHbs = hbs.create();

        // Output necessary notifications on init
        initNotifications();
        // ##Configuration

        // return the correct mime type for woff filess
        express['static'].mime.define({'application/font-woff': ['woff']});

        // enabled gzip compression by default
        if (config.server.compress !== false) {
            blogApp.use(compress());
        }

        // ## View engine
        // set the view engine
        blogApp.set('view engine', 'hbs');

        // Create a hbs instance for admin and init view engine
        adminApp.set('view engine', 'hbs');
        adminApp.engine('hbs', adminHbs.express3({}));

        // Load helpers
        helpers.loadCoreHelpers(adminHbs);

        // ## Middleware and Routing
        middleware(blogApp, adminApp);

        // Log all theme errors and warnings
        _.each(config.paths.availableThemes._messages.errors, function (error) {
            errors.logError(error.message, error.context, error.help);
        });

        _.each(config.paths.availableThemes._messages.warns, function (warn) {
            errors.logWarn(warn.message, warn.context, warn.help);
        });

        return new GhostServer(blogApp);
    });
}

module.exports = init;
