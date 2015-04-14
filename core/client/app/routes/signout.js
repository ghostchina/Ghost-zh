import Ember from 'ember';
import AuthenticatedRoute from 'ghost/routes/authenticated';
import styleBody from 'ghost/mixins/style-body';
import loadingIndicator from 'ghost/mixins/loading-indicator';

var SignoutRoute = AuthenticatedRoute.extend(styleBody, loadingIndicator, {
    titleToken: '退出',

    classNames: ['ghost-signout'],

    afterModel: function (model, transition) {
        this.notifications.clear();
        if (Ember.canInvoke(transition, 'send')) {
            transition.send('invalidateSession');
            transition.abort();
        } else {
            this.send('invalidateSession');
        }
    }
});

export default SignoutRoute;
