import Ember from 'ember';
import ValidationEngine from 'ghost/mixins/validation-engine';
import {request as ajax} from 'ic-ajax';

export default Ember.Controller.extend(ValidationEngine, {
    submitting: false,
    loggingIn: false,
    authProperties: ['identification', 'password'],

    ghostPaths: Ember.inject.service('ghost-paths'),
    notifications: Ember.inject.service(),
    session: Ember.inject.service(),
    application: Ember.inject.controller(),
    flowErrors: '',

    // ValidationEngine settings
    validationType: 'signin',

    actions: {
        authenticate: function () {
            var self = this,
                model = this.get('model'),
                authStrategy = 'authenticator:oauth2';

            // Authentication transitions to posts.index, we can leave spinner running unless there is an error
            this.get('session').authenticate(authStrategy, model.get('identification'), model.get('password')).catch(function (error) {
                self.toggleProperty('loggingIn');

                if (error.errors) {
                    error.errors.forEach(function (err) {
                        err.message = err.message.htmlSafe();
                    });

                    self.set('flowErrors', error.errors[0].message.string);

                    if (error.errors[0].message.string.match(/user with that email/)) {
                        self.get('model.errors').add('identification', '');
                    }

                    if (error.errors[0].message.string.match(/password is incorrect/)) {
                        self.get('model.errors').add('password', '');
                    }
                } else {
                    // Connection errors don't return proper status message, only req.body
                    self.get('notifications').showAlert('服务器端故障', {type: 'error', key: 'session.authenticate.failed'});
                }
            });
        },

        validateAndAuthenticate: function () {
            var self = this;
            this.set('flowErrors', '');
            // Manually trigger events for input fields, ensuring legacy compatibility with
            // browsers and password managers that don't send proper events on autofill
            $('#login').find('input').trigger('change');

            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'signin'
            this.get('hasValidated').addObjects(this.authProperties);
            this.validate({property: 'signin'}).then(function () {
                self.toggleProperty('loggingIn');
                self.send('authenticate');
            }).catch(function (error) {
                if (error) {
                    self.get('notifications').showAPIError(error, {key: 'signin.authenticate'});
                } else {
                    self.set('flowErrors', '请填写邮箱地址和密码');
                }
            });
        },

        forgotten: function () {
            var email = this.get('model.identification'),
                notifications = this.get('notifications'),
                self = this;

            this.set('flowErrors', '');
            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'forgotPassword'
            this.get('hasValidated').addObject('identification');
            this.validate({property: 'forgotPassword'}).then(function () {
                self.toggleProperty('submitting');

                ajax({
                    url: self.get('ghostPaths.url').api('authentication', 'passwordreset'),
                    type: 'POST',
                    data: {
                        passwordreset: [{
                            email: email
                        }]
                    }
                }).then(function () {
                    self.toggleProperty('submitting');
                    notifications.showAlert('请查看邮件并按照指令继续后续操作。', {type: 'info', key: 'forgot-password.send.success'});
                }).catch(function (resp) {
                    self.toggleProperty('submitting');
                    if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.errors) {
                        var message = resp.jqXHR.responseJSON.errors[0].message;

                        self.set('flowErrors', message);

                        if (message.match(/no user with that email/)) {
                            self.get('model.errors').add('identification', '');
                        }
                    } else {
                        notifications.showAPIError(resp, {defaultErrorText: '重置失败，请重试。', key: 'forgot-password.send'});
                    }
                });
            }).catch(function () {
                self.set('flowErrors', '请输入有效的邮箱地址，然后再点击“忘记密码？”。');
            });
        }
    }
});
