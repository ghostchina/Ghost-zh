var ResetValidator = Ember.Object.create({
    check: function (model) {
        var p1 = model.get('newPassword'),
            p2 = model.get('ne2Password'),
            validationErrors = [];

        if (!validator.equals(p1, p2)) {
            validationErrors.push({
                message: '两次输入的密码不匹配。'
            });
        }

        if (!validator.isLength(p1, 8)) {
            validationErrors.push({
                message: '密码太短。'
            });
        }
        return validationErrors;
    }
});

export default ResetValidator;
