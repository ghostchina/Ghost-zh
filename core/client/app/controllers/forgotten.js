import Ember from 'ember';
import ajax from 'ghost/utils/ajax';
import ValidationEngine from 'ghost/mixins/validation-engine';

var ForgottenController = Ember.Controller.extend(ValidationEngine, {
    email: '',
    submitting: false,

    // ValidationEngine settings
    validationType: 'forgotten',

    actions: {
        submit: function () {
            var data = this.getProperties('email');
            this.send('doForgotten', data, true);
        },
        doForgotten: function (data, delay) {
            var self = this;
            this.set('email', data.email);
            this.toggleProperty('submitting');
            this.validate({format: false}).then(function () {
                ajax({
                    url: self.get('ghostPaths.url').api('authentication', 'passwordreset'),
                    type: 'POST',
                    data: {
                        passwordreset: [{
                            email: data.email
                        }]
                    }
                }).then(function () {
                    self.toggleProperty('submitting');
<<<<<<< HEAD:core/client/controllers/forgotten.js
                    self.notifications.showSuccess('请查看邮箱中的邮件。', {delayed: true});
=======
                    self.notifications.showSuccess('Please check your email for instructions.', {delayed: delay});
>>>>>>> c2650a05c7f3c2b8280a34ea1eb9aaf3a6fc0c5f:core/client/app/controllers/forgotten.js
                    self.set('email', '');
                    self.transitionToRoute('signin');
                }).catch(function (resp) {
                    self.toggleProperty('submitting');
                    self.notifications.showAPIError(resp, {defaultErrorText: '重置密码出现故障，请重试。'});
                });
            }).catch(function (errors) {
                self.toggleProperty('submitting');
                self.notifications.showErrors(errors);
            });
        }
    }
});

export default ForgottenController;
