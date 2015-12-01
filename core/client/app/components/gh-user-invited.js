import Ember from 'ember';

const {Component, computed, inject} = Ember;

export default Component.extend({
    tagName: '',

    user: null,
    isSending: false,

    notifications: inject.service(),

    createdAt: computed('user.created_at', function () {
        let createdAt = this.get('user.created_at');

        return createdAt ? createdAt.fromNow() : '';
    }),

    actions: {
        resend() {
            let user = this.get('user');
            let notifications = this.get('notifications');

            this.set('isSending', true);
            user.resendInvite().then((result) => {
                let notificationText = `已发送邀请！ (${user.get('email')})`;

                // If sending the invitation email fails, the API will still return a status of 201
                // but the user's status in the response object will be 'invited-pending'.
                if (result.users[0].status === 'invited-pending') {
                    notifications.showAlert('邀请邮件未成功发送。请重新发送。', {type: 'error', key: 'invite.resend.not-sent'});
                } else {
                    user.set('status', result.users[0].status);
                    notifications.showNotification(notificationText);
                    notifications.closeAlerts('invite.resend');
                }
            }).catch((error) => {
                notifications.showAPIError(error, {key: 'invite.resend'});
            }).finally(() => {
                this.set('isSending', false);
            });
        },

        revoke() {
            let user = this.get('user');
            let email = user.get('email');
            let notifications = this.get('notifications');

            // reload the user to get the most up-to-date information
            user.reload().then(() => {
                if (user.get('invited')) {
                    user.destroyRecord().then(() => {
                        let notificationText = `邀请已取消。 (${email})`;
                        notifications.showNotification(notificationText);
                        notifications.closeAlerts('invite.revoke');
                    }).catch((error) => {
                        notifications.showAPIError(error, {key: 'invite.revoke'});
                    });
                } else {
                    // if the user is no longer marked as "invited", then show a warning and reload the route
                    this.sendAction('reload');
                    notifications.showAlert('此用户已经接受邀请。', {type: 'error', delayed: true, key: 'invite.revoke.already-accepted'});
                }
            });
        }
    }
});
