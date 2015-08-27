import Ember from 'ember';

export default Ember.Controller.extend({
    dropdown: Ember.inject.service(),
    notifications: Ember.inject.service(),

    actions: {
        confirmAccept: function () {
            var self = this,
                model = this.get('model');

            // definitely want to clear the data store and post of any unsaved, client-generated tags
            model.updateTags();

            model.destroyRecord().then(function () {
                self.get('dropdown').closeDropdowns();
                self.transitionToRoute('posts.index');
            }, function () {
                self.get('notifications').showAlert('删除博文失败，请重试。', {type: 'error'});
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
