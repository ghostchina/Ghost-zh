import Ember from 'ember';
import {request as ajax} from 'ic-ajax';

const {Controller, inject} = Ember;

export default Controller.extend({
    ghostPaths: inject.service('ghost-paths'),
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
            ajax(this.get('ghostPaths.url').api('db'), {
                type: 'DELETE'
            }).then(() => {
                this.get('notifications').showAlert('所有内容都已从数据库中删除了。', {type: 'success', key: 'all-content.delete.success'});
                this.store.unloadAll('post');
                this.store.unloadAll('tag');
            }).catch((response) => {
                this.get('notifications').showAPIError(response, {key: 'all-content.delete'});
            });
        },

        confirmReject() {
            return false;
        }
    }
});
