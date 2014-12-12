var DeleteUserController = Ember.ObjectController.extend({
    userPostCount: Ember.computed('id', function () {
        var promise,
            query = {
                author: this.get('slug'),
                status: 'all'
            };

        promise = this.store.find('post', query).then(function (results) {
            return results.meta.pagination.total;
        });

        return Ember.Object.extend(Ember.PromiseProxyMixin, {
            count: Ember.computed.alias('content'),

            inflection: Ember.computed('count', function () {
                return this.get('count') > 1 ? 'posts' : 'post';
            })
        }).create({promise: promise});
    }),

    actions: {
        confirmAccept: function () {
            var self = this,
                user = this.get('model');

            user.destroyRecord().then(function () {
                self.store.unloadAll('post');
                self.transitionToRoute('settings.users');
                self.notifications.showSuccess('用户已被删除。', { delayed: true });
            }, function () {
                self.notifications.showError('删除用户失败，请重试。');
            });
        },

        confirmReject: function () {
            return false;
        }
    },

    confirm: {
        accept: {
            text: 'Delete User',
            buttonClass: 'btn btn-red'
        },
        reject: {
            text: 'Cancel',
            buttonClass: 'btn btn-default btn-minor'
        }
    }
});

export default DeleteUserController;
