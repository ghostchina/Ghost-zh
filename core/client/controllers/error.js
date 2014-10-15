var ErrorController = Ember.Controller.extend({
    code: Ember.computed('content.status', function () {
        return this.get('content.status') > 200 ? this.get('content.status') : 500;
    }),
    message: Ember.computed('content.statusText', function () {
        if (this.get('code') === 404) {
            return '未找到 Ghost 系统';
        }

        return this.get('content.statusText') !== 'error' ? this.get('content.statusText') : '服务器内部错误';
    }),
    stack: false
});

export default ErrorController;
