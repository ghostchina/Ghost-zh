import Ember from 'ember';
var NewUserValidator = Ember.Object.extend({
    check: function (model) {
        var data = model.getProperties('name', 'email', 'password'),
            validationErrors = [];

        if (!validator.isLength(data.name, 1)) {
            validationErrors.push({
                message: '请输入姓名。'
            });
        }

        if (!validator.isEmail(data.email)) {
            validationErrors.push({
                message: '邮箱地址无效。'
            });
        }

        if (!validator.isLength(data.password, 8)) {
            validationErrors.push({
                message: '密码至少8个字符。'
            });
        }

        return validationErrors;
    }
});

export default NewUserValidator;
