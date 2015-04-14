import Ember from 'ember';
import styleBody from 'ghost/mixins/style-body';
import loadingIndicator from 'ghost/mixins/loading-indicator';

var ForgottenRoute = Ember.Route.extend(styleBody, loadingIndicator, {
    titleToken: '找回密码',

    classNames: ['ghost-forgotten']
});

export default ForgottenRoute;
