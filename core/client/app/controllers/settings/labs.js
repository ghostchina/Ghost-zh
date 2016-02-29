import Ember from 'ember';

const {
    $,
    Controller,
    inject: {service},
    isArray
} = Ember;

export default Controller.extend({
    uploadButtonText: '导入',
    importErrors: '',
    submitting: false,
    showDeleteAllModal: false,

    ghostPaths: service(),
    notifications: service(),
    session: service(),
    ajax: service(),

    actions: {
        onUpload(file) {
            let formData = new FormData();
            let notifications = this.get('notifications');
            let currentUserId = this.get('session.user.id');
            let dbUrl = this.get('ghostPaths.url').api('db');

            this.set('uploadButtonText', '导入中');
            this.set('importErrors', '');

            formData.append('importfile', file);

            this.get('ajax').post(dbUrl, {
                data: formData,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false
            }).then(() => {
                // Clear the store, so that all the new data gets fetched correctly.
                this.store.unloadAll();
                // Reload currentUser and set session
                this.set('session.user', this.store.findRecord('user', currentUserId));
                // TODO: keep as notification, add link to view content
                notifications.showNotification('导入成功。', {key: 'import.upload.success'});
            }).catch((response) => {
                if (response && response.errors && isArray(response.errors)) {
                    this.set('importErrors', response.errors);
                }

                notifications.showAlert('导入失', {type: 'error', key: 'import.upload.failed'});
            }).finally(() => {
                this.set('uploadButtonText', '导入');
            });
        },

        exportData() {
            let dbUrl = this.get('ghostPaths.url').api('db');
            let accessToken = this.get('session.data.authenticated.access_token');
            let downloadURL = `${dbUrl}?access_token=${accessToken}`;
            let iframe = $('#iframeDownload');

            if (iframe.length === 0) {
                iframe = $('<iframe>', {id: 'iframeDownload'}).hide().appendTo('body');
            }

            iframe.attr('src', downloadURL);
        },

        sendTestEmail() {
            let notifications = this.get('notifications');
            let emailUrl = this.get('ghostPaths.url').api('mail', 'test');

            this.toggleProperty('submitting');

            this.get('ajax').post(emailUrl).then(() => {
                notifications.showAlert('请检查邮箱中是否收到测试邮件。', {type: 'info', key: 'test-email.send.success'});
                this.toggleProperty('submitting');
            }).catch((error) => {
                notifications.showAPIError(error, {key: 'test-email:send'});
                this.toggleProperty('submitting');
            });
        },

        toggleDeleteAllModal() {
            this.toggleProperty('showDeleteAllModal');
        }
    }
});
