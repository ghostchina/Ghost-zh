var errors  = require('../errors'),
    storage = {};

var config  = require('../config/');

function getStorage(storageChoice) {
    // TODO: this is where the check for storage apps should go
    // Local file system is the default.  Fow now that is all we support.
    // storageChoice = 'local-file-store';

    //Now, we can support 3rd storages and local file system.
    storageChoice = (config.storage && config.storage.provider) || 'local-file-store';

    if (storage[storageChoice]) {
        return storage[storageChoice];
    }

    try {
        // TODO: determine if storage has all the necessary methods.
        storage[storageChoice] = require('./' + storageChoice);
    } catch (e) {
        errors.logError(e);
    }

    // Instantiate and cache the storage module instance.
    storage[storageChoice] = new storage[storageChoice]();

    return storage[storageChoice];
}

module.exports.getStorage = getStorage;
