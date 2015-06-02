import Ember from 'ember';

export default Ember.Controller.extend({
    notifications: Ember.inject.service(),

    acceptEncoding: 'image/*',

    actions: {
        confirmAccept: function () {
            var notifications = this.get('notifications');

            this.get('model').save().then(function (model) {
                notifications.showSuccess('已保存');
                return model;
            }).catch(function (err) {
                notifications.showErrors(err);
            });
        },

        confirmReject: function () {
            return false;
        }
    }
});
