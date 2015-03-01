// # Tag cloud helper
// Usage: `{{tag_cloud limit="5"}}`
// Defaults to limit="5"

var _               = require('lodash'),
    template        = require('./template'),
    config          = require('../config'),
    api             = require('../api'),
    tag_cloud;

tag_cloud = function (options) {
    var tagCloudOptions = (options || {}).hash || {};
    var limit = (_.has(tagCloudOptions, 'limit') && !/all/i.test(tagCloudOptions.limit))? parseInt(tagCloudOptions.limit, 10) : 'all';

    tagCloudOptions = _.pick(tagCloudOptions, ['limit']);
    tagCloudOptions = {
        limit: 'all',
        include: ['post_count'].join(','),
        context: 'internal'
    };

    return api.tags.browse(tagCloudOptions).then(function(tags){
        var sortedTags = _.sortBy(tags.tags, 'post_count').reverse();

        if(limit !== 'all') {
            sortedTags = sortedTags.slice(0, limit);
        }

        sortedTags.forEach(function(){
            this.url = config.urlFor('tag', {tag: this}, false);
        });

        return template.execute('tag_cloud',  {tags:sortedTags});
    });
};

module.exports = tag_cloud;
