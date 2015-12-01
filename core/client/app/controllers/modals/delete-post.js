import Ember from 'ember';

const {Controller, inject} = Ember;

export default Controller.extend({
    dropdown: inject.service(),
    notifications: inject.service(),

    confirm: {
        accept: {
            text: '删除',
            buttonClass: 'btn btn-red'
        },
        reject: {
            text: '取消',
            buttonClass: 'btn btn-default btn-minor'
        }
    },

    actions: {
        confirmAccept() {
            let model = this.get('model');

            // definitely want to clear the data store and post of any unsaved, client-generated tags
            model.updateTags();

            model.destroyRecord().then(() => {
                this.get('dropdown').closeDropdowns();
                this.get('notifications').closeAlerts('post.delete');
                this.transitionToRoute('posts.index');
            }, () => {
                this.get('notifications').showAlert('无法删除此博文。请重试。', {type: 'error', key: 'post.delete.failed'});
            });
        },

        confirmReject() {
            return false;
        }
    }
});
