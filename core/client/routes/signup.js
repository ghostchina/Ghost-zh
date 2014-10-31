import styleBody from 'ghost/mixins/style-body';
import loadingIndicator from 'ghost/mixins/loading-indicator';

var SignupRoute = Ember.Route.extend(styleBody, loadingIndicator, {
    classNames: ['ghost-signup'],
    beforeModel: function () {
        if (this.get('session').isAuthenticated) {
            this.notifications.showWarn('你应该先退出登录然后再注册新用户。', { delayed: true });
            this.transitionTo(SimpleAuth.Configuration.routeAfterAuthentication);
        }
    },

    model: function (params) {
        var self = this,
            tokenText,
            email,
            model = {},
            re = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

        return new Ember.RSVP.Promise(function (resolve) {
            if (!re.test(params.token)) {
                self.notifications.showError('Invalid token.', {delayed: true});

                return resolve(self.transitionTo('signin'));
            }

            tokenText = atob(params.token);
            email = tokenText.split('|')[1];

            model.email = email;
            model.token = params.token;

            return ic.ajax.request({
                url: self.get('ghostPaths.url').api('authentication', 'invitation'),
                type: 'GET',
                dataType: 'json',
                data: {
                    email: email
                }
            }).then(function (response) {
                if (response && response.invitation && response.invitation[0].valid === false) {
                    self.notifications.showError('邀请不存在或已经失效。', { delayed: true });

                    return resolve(self.transitionTo('signin'));
                }

                resolve(model);
            }).catch(function () {
                resolve(model);
            });
        });
    },

    deactivate: function () {
        this._super();

        // clear the properties that hold the sensitive data from the controller
        this.controllerFor('signup').setProperties({email: '', password: '', token: ''});
    }
});

export default SignupRoute;
