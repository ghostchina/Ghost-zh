import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['name', 'bio', 'email', 'location', 'website', 'roles'],

    isActive(model) {
        return (model.get('status') === 'active');
    },

    name(model) {
        let name = model.get('name');

        if (this.isActive(model)) {
            if (validator.empty(name)) {
                model.get('errors').add('name', '请输入姓名');
                this.invalidate();
            } else if (!validator.isLength(name, 0, 150)) {
                model.get('errors').add('name', '姓名太长');
                this.invalidate();
            }
        }
    },

    bio(model) {
        let bio = model.get('bio');

        if (this.isActive(model)) {
            if (!validator.isLength(bio, 0, 200)) {
                model.get('errors').add('bio', '个人简介太长');
                this.invalidate();
            }
        }
    },

    email(model) {
        let email = model.get('email');

        if (!validator.isEmail(email)) {
            model.get('errors').add('email', '请输入有效的邮箱地址');
            this.invalidate();
        }
    },

    location(model) {
        let location = model.get('location');

        if (this.isActive(model)) {
            if (!validator.isLength(location, 0, 150)) {
                model.get('errors').add('location', '所在地太长');
                this.invalidate();
            }
        }
    },

    website(model) {
        let website = model.get('website');

        /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
        if (this.isActive(model)) {
            if (!validator.empty(website) &&
                (!validator.isURL(website, {require_protocol: false}) ||
                !validator.isLength(website, 0, 2000))) {

                model.get('errors').add('website', '网址地址无效');
                this.invalidate();
            }
        }
        /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
    },

    roles(model) {
        if (!this.isActive(model)) {
            let roles = model.get('roles');

            if (roles.length < 1) {
                model.get('errors').add('role', '请选择角色/权限');
                this.invalidate();
            }
        }
    }
});
