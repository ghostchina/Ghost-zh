import Ember from 'ember';
var ApplicationController = Ember.Controller.extend({
    // jscs: disable
    signedOut: Ember.computed.match('currentPath', /(signin|signup|setup|reset)/),
    // jscs: enable

    topNotificationCount: 0,
    showGlobalMobileNav: false,
    showSettingsMenu: false,

    userImage: Ember.computed('session.user.image', function () {
        return this.get('session.user.image') || this.get('ghostPaths.url').asset('/shared/img/user-image.png');
    }),

    userImageBackground: Ember.computed('userImage', function () {
        return `background-image: url(${this.get('userImage')})`.htmlSafe();
    }),

    userImageAlt: Ember.computed('session.user.name', function () {
        var name = this.get('session.user.name');

        return (name) ? name + '的头像' : '头像';
    }),

    actions: {
        topNotificationChange: function (count) {
            this.set('topNotificationCount', count);
        }
    }
});

export default ApplicationController;
