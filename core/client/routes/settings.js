import AuthenticatedRoute from 'ghost/routes/authenticated';
import styleBody from 'ghost/mixins/style-body';
import loadingIndicator from 'ghost/mixins/loading-indicator';

var SettingsRoute = AuthenticatedRoute.extend(styleBody, loadingIndicator, {
    titleToken: '博客设置',

    classNames: ['settings']
});

export default SettingsRoute;
