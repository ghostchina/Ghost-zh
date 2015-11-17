import Ember from 'ember';
import {request as ajax} from 'ic-ajax';

export default Ember.Controller.extend({
    ghostPaths: Ember.inject.service('ghost-paths'),
    notifications: Ember.inject.service(),

    actions: {
        confirmAccept: function () {
            var self = this;

            ajax(this.get('ghostPaths.url').api('db'), {
                type: 'DELETE'
            }).then(function () {
                self.get('notifications').showAlert('所有内容都已经从数据库中删掉了。', {type: 'success', key: 'all-content.delete.success'});
                self.store.unloadAll('post');
                self.store.unloadAll('tag');
            }).catch(function (response) {
                self.get('notifications').showAPIError(response, {key: 'all-content.delete'});
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
