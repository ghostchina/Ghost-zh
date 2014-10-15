var PostValidator = Ember.Object.create({
    check: function (model) {
        var validationErrors = [],
            data = model.getProperties('title', 'meta_title', 'meta_description');

        if (validator.empty(data.title)) {
            validationErrors.push({
                message: '必须为博文输入标题。'
            });
        }

        if (!validator.isLength(data.meta_title, 0, 150)) {
            validationErrors.push({
                message: '优化标题不能超过150个字符。'
            });
        }

        if (!validator.isLength(data.meta_description, 0, 200)) {
            validationErrors.push({
                message: '优化页面描述不能超过200个字符。'
            });
        }

        return validationErrors;
    }
});

export default PostValidator;
