import Ember from 'ember';
import ValidationEngine from 'ghost/mixins/validation-engine';
import {request as ajax} from 'ic-ajax';

const {$, Controller, inject} = Ember;

export default Controller.extend(ValidationEngine, {
    submitting: false,
    loggingIn: false,
    authProperties: ['identification', 'password'],

    ghostPaths: inject.service('ghost-paths'),
    notifications: inject.service(),
    session: inject.service(),
    application: inject.controller(),
    flowErrors: '',

    // ValidationEngine settings
    validationType: 'signin',

    actions: {
        authenticate() {
            let model = this.get('model');
            let authStrategy = 'authenticator:oauth2';

            // Authentication transitions to posts.index, we can leave spinner running unless there is an error
            this.get('session').authenticate(authStrategy, model.get('identification'), model.get('password')).catch((error) => {
                this.toggleProperty('loggingIn');

                if (error && error.errors) {
                    error.errors.forEach((err) => {
                        err.message = err.message.htmlSafe();
                    });

                    this.set('flowErrors', error.errors[0].message.string);

                    if (error.errors[0].message.string.match(/user with that email/)) {
                        this.get('model.errors').add('identification', '');
                    }

                    if (error.errors[0].message.string.match(/password is incorrect/)) {
                        this.get('model.errors').add('password', '');
                    }
                } else {
                    // Connection errors don't return proper status message, only req.body
                    this.get('notifications').showAlert('服务器端故障。', {type: 'error', key: 'session.authenticate.failed'});
                }
            });
        },

        validateAndAuthenticate() {
            this.set('flowErrors', '');
            // Manually trigger events for input fields, ensuring legacy compatibility with
            // browsers and password managers that don't send proper events on autofill
            $('#login').find('input').trigger('change');

            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'signin'
            this.get('hasValidated').addObjects(this.authProperties);
            this.validate({property: 'signin'}).then(() => {
                this.toggleProperty('loggingIn');
                this.send('authenticate');
            }).catch((error) => {
                if (error) {
                    this.get('notifications').showAPIError(error, {key: 'signin.authenticate'});
                } else {
                    this.set('flowErrors', '请填写表单以完成注册。');
                }
            });
        },

        forgotten() {
            let email = this.get('model.identification');
            let notifications = this.get('notifications');

            this.set('flowErrors', '');
            // This is a bit dirty, but there's no other way to ensure the properties are set as well as 'forgotPassword'
            this.get('hasValidated').addObject('identification');
            this.validate({property: 'forgotPassword'}).then(() => {
                this.toggleProperty('submitting');

                ajax({
                    url: this.get('ghostPaths.url').api('authentication', 'passwordreset'),
                    type: 'POST',
                    data: {
                        passwordreset: [{email}]
                    }
                }).then(() => {
                    this.toggleProperty('submitting');
                    notifications.showAlert('请查看邮件并按照指令继续后续操作。', {type: 'info', key: 'forgot-password.send.success'});
                }).catch((resp) => {
                    this.toggleProperty('submitting');
                    if (resp && resp.jqXHR && resp.jqXHR.responseJSON && resp.jqXHR.responseJSON.errors) {
                        let [error] = resp.jqXHR.responseJSON.errors;
                        let {message} = error;

                        this.set('flowErrors', message);

                        if (message.match(/no user with that email/)) {
                            this.get('model.errors').add('identification', '');
                        }
                    } else {
                        notifications.showAPIError(resp, {defaultErrorText: '重置失败，请重试。', key: 'forgot-password.send'});
                    }
                });
            }).catch(() => {
                this.set('flowErrors', '请输入有效的邮箱地址以完成密码重置！');
            });
        }
    }
});
