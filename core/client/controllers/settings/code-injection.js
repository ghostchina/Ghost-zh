var SettingsCodeInjectionController = Ember.ObjectController.extend({
    actions: {
        save: function () {
            var self = this;

            return this.get('model').save().then(function (model) {
                self.notifications.closePassive();
                self.notifications.showSuccess('已成功保存设置。');

                return model;
            }).catch(function (errors) {
                self.notifications.closePassive();
                self.notifications.showErrors(errors);
            });
        }
    }
});

export default SettingsCodeInjectionController;
