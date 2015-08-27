import BaseValidator from './base';

var NewUserValidator = BaseValidator.extend({
    properties: ['name', 'email', 'password'],

    name: function (model) {
        var name = model.get('name');

        if (!validator.isLength(name, 1)) {
            model.get('errors').add('name', '请输入姓名。');
            this.invalidate();
        }
    },
    email: function (model) {
        var email = model.get('email');

        if (validator.empty(email)) {
            model.get('errors').add('email', '请输入邮箱地址。');
            this.invalidate();
        } else if (!validator.isEmail(email)) {
            model.get('errors').add('email', '邮箱地址无效。');
            this.invalidate();
        }
    },
    password: function (model) {
        var password = model.get('password');

        if (!validator.isLength(password, 8)) {
            model.get('errors').add('password', '密码至少 8 个字符。');
            this.invalidate();
        }
    }
});

export default NewUserValidator;
