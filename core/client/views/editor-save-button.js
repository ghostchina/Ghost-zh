var EditorSaveButtonView = Ember.View.extend({
    templateName: 'editor-save-button',
    tagName: 'section',
    classNames: ['splitbtn', 'js-publish-splitbutton'],

    // Tracks whether we're going to change the state of the post on save
    isDangerous: Ember.computed('controller.model.isPublished', 'controller.willPublish', function () {
        return this.get('controller.model.isPublished') !== this.get('controller.willPublish');
    }),

    publishText: Ember.computed('controller.model.isPublished', function () {
        return this.get('controller.model.isPublished') ? '更新博文' : '立即发布';
    }),

    draftText: Ember.computed('controller.model.isPublished', function () {
        return this.get('controller.model.isPublished') ? '撤销发布' : '保存草稿';
    }),

    saveText: Ember.computed('controller.willPublish', function () {
        return this.get('controller.willPublish') ? this.get('publishText') : this.get('draftText');
    })
});

export default EditorSaveButtonView;
