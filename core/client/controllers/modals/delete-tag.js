var DeleteTagController = Ember.Controller.extend({
    postInflection: Ember.computed('model.post_count', function () {
        return this.get('model.post_count') > 1 ? 'posts' : 'post';
    }),

    actions: {
        confirmAccept: function () {
            var tag = this.get('model'),
                name = tag.get('name'),
                self = this;

            this.send('closeSettingsMenu');

            tag.destroyRecord().then(function () {
                self.notifications.showSuccess('已删除 ' + name);
            }).catch(function (error) {
                self.notifications.showAPIError(error);
            });
        },

        confirmReject: function () {
            return false;
        }
    },

    confirm: {
        accept: {
            text: '删除',
            buttonClass: 'btn btn-red'
        },
        reject: {
            text: '取消',
            buttonClass: 'btn btn-default btn-minor'
        }
    }
});

export default DeleteTagController;
