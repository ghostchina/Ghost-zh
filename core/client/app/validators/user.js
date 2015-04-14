import Ember from 'ember';
var UserValidator = Ember.Object.create({
    check: function (model) {
        var validator = this.validators[model.get('status')];

        if (typeof validator !== 'function') {
            return [];
        }

        return validator(model);
    },

    validators: {
        invited: function (model) {
            var validationErrors = [],
                email = model.get('email'),
                roles = model.get('roles');

            if (!validator.isEmail(email)) {
                validationErrors.push({ message: '请输入有效的邮箱地址' });
            }

            if (roles.length < 1) {
                validationErrors.push({ message: '请为用户选择角色/权限' });
            }

            return validationErrors;
        },

        active: function (model) {
            var validationErrors = [],
                name = model.get('name'),
                bio = model.get('bio'),
                email = model.get('email'),
                location = model.get('location'),
                website = model.get('website');

            if (!validator.isLength(name, 0, 150)) {
                validationErrors.push({ message: '姓名太长' });
            }

            if (!validator.isLength(bio, 0, 200)) {
                validationErrors.push({ message: '个人简介太长' });
            }

            if (!validator.isEmail(email)) {
                validationErrors.push({ message: '请输入有效的邮箱地址' });
            }

            if (!validator.isLength(location, 0, 150)) {
                validationErrors.push({ message: '所在地太长' });
            }

            if (!Ember.isEmpty(website) &&
                (!validator.isURL(website, {require_protocol: false}) ||
                !validator.isLength(website, 0, 2000))) {
                validationErrors.push({ message: '个人网站不是有效的网址' });
            }

            return validationErrors;
        }
    }
});

export default UserValidator;
