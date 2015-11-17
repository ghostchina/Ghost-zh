import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['title', 'metaTitle', 'metaDescription'],

    title: function (model) {
        var title = model.get('title');

        if (validator.empty(title)) {
            model.get('errors').add('title', '必须为博文设置一个标题。');
            this.invalidate();
        }

        if (!validator.isLength(title, 0, 150)) {
            model.get('errors').add('title', 'Title cannot be longer than 150 characters.');
            this.invalidate();
        }
    },

    metaTitle: function (model) {
        var metaTitle = model.get('meta_title');

        if (!validator.isLength(metaTitle, 0, 150)) {
            model.get('errors').add('meta_title', '优化标题不能超过 150 个字符。');
            this.invalidate();
        }
    },

    metaDescription: function (model) {
        var metaDescription = model.get('meta_description');

        if (!validator.isLength(metaDescription, 0, 200)) {
            model.get('errors').add('meta_description', '优化描述不能超过 200 个字符。');
            this.invalidate();
        }
    }
});
