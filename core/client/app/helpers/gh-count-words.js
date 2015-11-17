import Ember from 'ember';
import counter from 'ghost/utils/word-count';

export default Ember.Helper.helper(function (params) {
    if (!params || !params.length) {
        return;
    }

    var markdown,
        count;

    markdown = params[0] || '';

    if (/^\s*$/.test(markdown)) {
        return '0 个字';
    }

    count = counter(markdown);

    return count + (count === 1 ? ' 个字' : ' 个字');
});
