import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['newPassword'],

    newPassword(model) {
        let p1 = model.get('newPassword');
        let p2 = model.get('ne2Password');

        if (validator.empty(p1)) {
            model.get('errors').add('newPassword', '请输入一个新密码');
            this.invalidate();
        } else if (!validator.isLength(p1, 8)) {
            model.get('errors').add('newPassword', '新密码太短');
            this.invalidate();
        } else if (!validator.equals(p1, p2)) {
            model.get('errors').add('ne2Password', '两次输入的新密码不一致');
            this.invalidate();
        }
    }
});
