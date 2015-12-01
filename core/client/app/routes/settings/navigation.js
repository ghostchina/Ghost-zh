import AuthenticatedRoute from 'ghost/routes/authenticated';
import CurrentUserSettings from 'ghost/mixins/current-user-settings';
import styleBody from 'ghost/mixins/style-body';

export default AuthenticatedRoute.extend(styleBody, CurrentUserSettings, {
    titleToken: '设置 - 导航菜单',

    classNames: ['settings-view-navigation'],

    beforeModel() {
        this._super(...arguments);
        return this.get('session.user')
            .then(this.transitionAuthor());
    },

    model() {
        return this.store.query('setting', {type: 'blog,theme'}).then((records) => {
            return records.get('firstObject');
        });
    },

    actions: {
        save() {
            // since shortcuts are run on the route, we have to signal to the components
            // on the page that we're about to save.
            $('.page-actions .btn-blue').focus();

            this.get('controller').send('save');
        },

        willTransition() {
            // reset the model so that our CPs re-calc and unsaved changes aren't
            // persisted across transitions
            this.set('controller.model', null);
            return this._super(...arguments);
        }
    }
});
