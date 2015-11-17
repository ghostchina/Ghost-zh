import DS from 'ember-data';

moment.locale("zh-cn");

/* global moment */

export default DS.Transform.extend({
    deserialize: function (serialized) {
        if (serialized) {
            return moment(serialized);
        }
        return serialized;
    },
    serialize: function (deserialized) {
        if (deserialized) {
            return moment(deserialized).toDate();
        }
        return deserialized;
    }
});
