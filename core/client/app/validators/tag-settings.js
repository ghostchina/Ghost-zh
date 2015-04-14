import Ember from 'ember';
var TagSettingsValidator = Ember.Object.create({
    check: function (model) {
        var validationErrors = [],
            data = model.getProperties('name', 'meta_title', 'meta_description');

        if (validator.empty(data.name)) {
            validationErrors.push({
                message: '未设置标签名。'
            });
        }

        if (!validator.isLength(data.meta_title, 0, 150)) {
            validationErrors.push({
                message: '优化标题不能超过 150 个字符。'
            });
        }

        if (!validator.isLength(data.meta_description, 0, 200)) {
            validationErrors.push({
                message: '优化描述不能超过 200 个字符。'
            });
        }

        return validationErrors;
    }
});

export default TagSettingsValidator;
