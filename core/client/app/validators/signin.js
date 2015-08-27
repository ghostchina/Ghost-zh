import BaseValidator from './base';

var SigninValidator = BaseValidator.create({
    properties: ['identification', 'signin', 'forgotPassword'],

    identification: function (model) {
        var id = model.get('identification');

        if (!validator.empty(id) && !validator.isEmail(id)) {
            model.get('errors').add('identification', '邮箱地址无效');
            this.invalidate();
        }
    },

    signin: function (model) {
        var id = model.get('identification'),
            password = model.get('password');

        model.get('errors').clear();

        if (validator.empty(id)) {
            model.get('errors').add('identification', '请输入邮箱地址');
            this.invalidate();
        }

        if (validator.empty(password)) {
            model.get('errors').add('password', '请输入密码');
            this.invalidate();
        }
    },

    forgotPassword: function (model) {
        var id = model.get('identification');

        model.get('errors').clear();

        if (validator.empty(id) || !validator.isEmail(id)) {
            model.get('errors').add('identification', '邮箱地址无效');
            this.invalidate();
        }
    }
});

export default SigninValidator;
