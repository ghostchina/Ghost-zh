import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['title', 'description', 'password', 'postsPerPage'],
    title: function (model) {
        var title = model.get('title');

        if (!validator.isLength(title, 0, 150)) {
            model.get('errors').add('title', '标题太长');
            this.invalidate();
        }
    },
    description: function (model) {
        var desc = model.get('description');

        if (!validator.isLength(desc, 0, 200)) {
            model.get('errors').add('description', '描述太长');
            this.invalidate();
        }
    },
    password: function (model) {
        var isPrivate = model.get('isPrivate'),
            password = model.get('password');

        if (isPrivate && password === '') {
            model.get('errors').add('password', '必须填写密码');
            this.invalidate();
        }
    },
    postsPerPage: function (model) {
        var postsPerPage = model.get('postsPerPage');

        if (!validator.isInt(postsPerPage)) {
            model.get('errors').add('postsPerPage', '请为每页展示的博文数量输入一个数字');
            this.invalidate();
        } else if (postsPerPage > 1000) {
            model.get('errors').add('postsPerPage', '每页展示的博文数量最多是 1000');
            this.invalidate();
        } else if (postsPerPage < 1) {
            model.get('errors').add('postsPerPage', '每页展示的博文数量最少是 1');
            this.invalidate();
        }
    }
});
