import BaseValidator from './base';

var TagSettingsValidator = BaseValidator.create({
    properties: ['name', 'metaTitle', 'metaDescription'],
    name: function (model) {
        var name = model.get('name');

        if (validator.empty(name)) {
            model.get('errors').add('name', '必须为标签设置一个名称');
            this.invalidate();
        } else if (name.match(/^,/)) {
            model.get('errors').add('name', 'Tag names can\'t start with commas.');
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

export default TagSettingsValidator;
