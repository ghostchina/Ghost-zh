import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'section',
    classNames: ['splitbtn', 'js-publish-splitbutton'],
    classNameBindings: ['isNew:unsaved'],

    isNew: null,
    isPublished: null,
    willPublish: null,
    postOrPage: null,
    submitting: false,

    // Tracks whether we're going to change the state of the post on save
    isDangerous: Ember.computed('isPublished', 'willPublish', function () {
        return this.get('isPublished') !== this.get('willPublish');
    }),

    publishText: Ember.computed('isPublished', 'postOrPage', function () {
        return this.get('isPublished') ? '更新' + this.get('postOrPage') : '立即发布';
    }),

    draftText: Ember.computed('isPublished', function () {
        return this.get('isPublished') ? '撤销发布' : '保存草稿';
    }),

    deleteText: Ember.computed('postOrPage', function () {
        return '删除' + this.get('postOrPage');
    }),

    saveText: Ember.computed('willPublish', 'publishText', 'draftText', function () {
        return this.get('willPublish') ? this.get('publishText') : this.get('draftText');
    }),

    actions: {
        save: function () {
            this.sendAction('save');
        },

        setSaveType: function (saveType) {
            this.sendAction('setSaveType', saveType);
        },

        delete: function () {
            this.sendAction('delete');
        }
    }
});
