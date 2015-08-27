import NewUserValidator from 'ghost/validators/new-user';

var SetupValidator = NewUserValidator.create({
    properties: ['name', 'email', 'password', 'blogTitle'],

    blogTitle: function (model) {
        var blogTitle = model.get('blogTitle');

        if (!validator.isLength(blogTitle, 1)) {
            model.get('errors').add('blogTitle', '请输入博客名称。');
            this.invalidate();
        }
    }
});

export default SetupValidator;
