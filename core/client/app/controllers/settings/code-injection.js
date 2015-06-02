import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        save: function () {
            var notifications = this.get('notifications');

            return this.get('model').save().then(function (model) {
                notifications.closePassive();
                notifications.showSuccess('已成功保存设置。');

                return model;
            }).catch(function (errors) {
                notifications.closePassive();
                notifications.showErrors(errors);
            });
        }
    }
});
