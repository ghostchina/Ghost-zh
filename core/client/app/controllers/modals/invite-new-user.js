import Ember from 'ember';
import ValidationEngine from 'ghost/mixins/validation-engine';

const {Controller, computed, inject, observer} = Ember;

export default Controller.extend(ValidationEngine, {
    notifications: inject.service(),

    validationType: 'signup',

    role: null,
    authorRole: null,

    roles: computed(function () {
        return this.store.query('role', {permissions: 'assign'});
    }),

    // Used to set the initial value for the dropdown
    authorRoleObserver: observer('roles.@each.role', function () {
        this.get('roles').then((roles) => {
            let authorRole = roles.findBy('name', 'Author');

            this.set('authorRole', authorRole);

            if (!this.get('role')) {
                this.set('role', authorRole);
            }
        });
    }),

    confirm: {
        accept: {
            text: '立即发送邀请'
        },
        reject: {
            buttonClass: 'hidden'
        }
    },

    confirmReject() {
        return false;
    },

    actions: {
        setRole(role) {
            this.set('role', role);
        },

        confirmAccept() {
            let email = this.get('email');
            let role = this.get('role');
            let validationErrors = this.get('errors.messages');
            let newUser;

            // reset the form and close the modal
            this.set('email', '');
            this.set('role', this.get('authorRole'));

            this.store.findAll('user', {reload: true}).then((result) => {
                let invitedUser = result.findBy('email', email);

                if (invitedUser) {
                    if (invitedUser.get('status') === 'invited' || invitedUser.get('status') === 'invited-pending') {
                        this.get('notifications').showAlert('已经邀请了此邮箱的持有人。', {type: 'warn', key: 'invite.send.already-invited'});
                    } else {
                        this.get('notifications').showAlert('此邮箱/用户已存在。', {type: 'warn', key: 'invite.send.user-exists'});
                    }
                } else {
                    newUser = this.store.createRecord('user', {
                        email,
                        role,
                        status: 'invited'
                    });

                    newUser.save().then(() => {
                        let notificationText = `邀请已发送！ (${email})`;

                        // If sending the invitation email fails, the API will still return a status of 201
                        // but the user's status in the response object will be 'invited-pending'.
                        if (newUser.get('status') === 'invited-pending') {
                            this.get('notifications').showAlert('邀请邮件未能发送！请重新发送。', {type: 'error', key: 'invite.send.failed'});
                        } else {
                            this.get('notifications').closeAlerts('invite.send');
                            this.get('notifications').showNotification(notificationText);
                        }
                    }).catch((errors) => {
                        newUser.deleteRecord();
                        // TODO: user model includes ValidationEngine mixin so
                        // save is overridden in order to validate, we probably
                        // want to use inline-validations here and only show an
                        // alert if we have an actual error
                        if (errors) {
                            this.get('notifications').showErrors(errors, {key: 'invite.send'});
                        } else if (validationErrors) {
                            this.get('notifications').showAlert(validationErrors.toString(), {type: 'error', key: 'invite.send.validation-error'});
                        }
                    }).finally(() => {
                        this.get('errors').clear();
                    });
                }
            });
        }
    }
});
