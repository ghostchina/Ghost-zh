import Ember from 'ember';
var SettingValidator = Ember.Object.create({
    check: function (model) {
        var validationErrors = [],
            title = model.get('title'),
            description = model.get('description'),
            email = model.get('email'),
            postsPerPage = model.get('postsPerPage');

        if (!validator.isLength(title, 0, 150)) {
            validationErrors.push({ message: '标题太长' });
        }

        if (!validator.isLength(description, 0, 200)) {
            validationErrors.push({ message: '描述信息太长' });
        }

        if (!validator.isEmail(email) || !validator.isLength(email, 0, 254)) {
            validationErrors.push({ message: '请输入正确的邮箱地址' });
        }

        if (postsPerPage > 1000) {
            validationErrors.push({ message: '每页最多展示博文数量是 1000' });
        }

        if (postsPerPage < 1) {
            validationErrors.push({ message: '每页最少展示博文数量是 1' });
        }

        if (!validator.isInt(postsPerPage)) {
            validationErrors.push({ message: '请为每页展示的博文数量输入一个数字' });
        }

        return validationErrors;
    }
});

export default SettingValidator;
