import BaseValidator from './base';

export default BaseValidator.create({
    properties: ['name', 'slug', 'description', 'metaTitle', 'metaDescription'],

    name(model) {
        let name = model.get('name');

        if (validator.empty(name)) {
            model.get('errors').add('name', '必须为标签设置一个名称');
            this.invalidate();
        } else if (name.match(/^,/)) {
            model.get('errors').add('name', '标签名不能以逗号(,)开头。');
            this.invalidate();
        } else if (!validator.isLength(name, 0, 150)) {
            model.get('errors').add('name', '标签名不能超过 150 个字符。');
            this.invalidate();
        }
    },

    slug(model) {
        let slug = model.get('slug');

        if (!validator.isLength(slug, 0, 150)) {
            model.get('errors').add('slug', 'URL 的长度不能超过 150 个字符。');
            this.invalidate();
        }
    },

    description(model) {
        let description = model.get('description');

        if (!validator.isLength(description, 0, 200)) {
            model.get('errors').add('description', '描述信息不能超过 200 个字符。');
            this.invalidate();
        }
    },

    metaTitle(model) {
        let metaTitle = model.get('meta_title');

        if (!validator.isLength(metaTitle, 0, 150)) {
            model.get('errors').add('meta_title', '优化标题不能超过 150 个字符。');
            this.invalidate();
        }
    },

    metaDescription(model) {
        let metaDescription = model.get('meta_description');

        if (!validator.isLength(metaDescription, 0, 200)) {
            model.get('errors').add('meta_description', '优化描述不能超过 200 个字符。');
            this.invalidate();
        }
    }
});
