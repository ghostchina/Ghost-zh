import Ember from 'ember';

export default Ember.Component.extend({
    tagName: '',

    user: null,
    isSending: false,

    notifications: Ember.inject.service(),

    createdAt: Ember.computed('user.created_at', function () {
        var createdAt = this.get('user.created_at');

        return createdAt ? createdAt.fromNow() : '';
    }),

    actions: {
        resend: function () {
            var user = this.get('user'),
                notifications = this.get('notifications'),
                self = this;

            this.set('isSending', true);
            user.resendInvite().then(function (result) {
                var notificationText = '已发送邀请！ (' + user.get('email') + ')';

                // If sending the invitation email fails, the API will still return a status of 201
                // but the user's status in the response object will be 'invited-pending'.
                if (result.users[0].status === 'invited-pending') {
                    notifications.showAlert('邀请邮件未成功发送。请重新发送。', {type: 'error', key: 'invite.resend.not-sent'});
                } else {
                    user.set('status', result.users[0].status);
                    notifications.showNotification(notificationText);
                    notifications.closeAlerts('invite.resend');
                }
            }).catch(function (error) {
                notifications.showAPIError(error, {key: 'invite.resend'});
            }).finally(function () {
                self.set('isSending', false);
            });
        },

        revoke: function () {
            var user = this.get('user'),
                email = user.get('email'),
                notifications = this.get('notifications'),
                self = this;

            // reload the user to get the most up-to-date information
            user.reload().then(function () {
                if (user.get('invited')) {
                    user.destroyRecord().then(function () {
                        var notificationText = '邀请已取消。 (' + email + ')';
                        notifications.showNotification(notificationText);
                        notifications.closeAlerts('invite.revoke');
                    }).catch(function (error) {
                        notifications.showAPIError(error, {key: 'invite.revoke'});
                    });
                } else {
                    // if the user is no longer marked as "invited", then show a warning and reload the route
                    self.sendAction('reload');
                    notifications.showAlert('此用户已经接受邀请。', {type: 'error', delayed: true, key: 'invite.revoke.already-accepted'});
                }
            });
        }
    }
});
