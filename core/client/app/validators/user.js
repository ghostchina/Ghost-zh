import BaseValidator from './base';
import Ember from 'ember';

export default BaseValidator.create({
    properties: ['name', 'bio', 'email', 'location', 'website', 'roles'],
    isActive: function (model) {
        return (model.get('status') === 'active');
    },
    name: function (model) {
        var name = model.get('name');

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
    bio: function (model) {
        var bio = model.get('bio');

        if (this.isActive(model)) {
            if (!validator.isLength(bio, 0, 200)) {
                model.get('errors').add('bio', '个人简介太长');
                this.invalidate();
            }
        }
    },
    email: function (model) {
        var email = model.get('email');

        if (!validator.isEmail(email)) {
            model.get('errors').add('email', '请输入有效的邮箱地址');
            this.invalidate();
        }
    },
    location: function (model) {
        var location = model.get('location');

        if (this.isActive(model)) {
            if (!validator.isLength(location, 0, 150)) {
                model.get('errors').add('location', '所在地太长');
                this.invalidate();
            }
        }
    },
    website: function (model) {
        var website = model.get('website');

        if (this.isActive(model)) {
            if (!Ember.isEmpty(website) &&
                (!validator.isURL(website, {require_protocol: false}) ||
                !validator.isLength(website, 0, 2000))) {
                model.get('errors').add('website', '个人网站不是有效的网址');
                this.invalidate();
            }
        }
    },
    roles: function (model) {
        if (!this.isActive(model)) {
            var roles = model.get('roles');

            if (roles.length < 1) {
                model.get('errors').add('role', '请选择角色/权限');
                this.invalidate();
            }
        }
    }
});
