import Ember from 'ember';
import AuthenticatedRoute from 'ghost/routes/authenticated';
import styleBody from 'ghost/mixins/style-body';

export default AuthenticatedRoute.extend(styleBody, {
    titleToken: '退出',

    classNames: ['ghost-signout'],

    notifications: Ember.inject.service(),

    afterModel: function (model, transition) {
        this.get('notifications').clearAll();
        if (Ember.canInvoke(transition, 'send')) {
            transition.send('invalidateSession');
            transition.abort();
        } else {
            this.send('invalidateSession');
        }
    }
});
