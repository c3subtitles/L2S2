import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'onetimetoken',
  connection: 'default',
  attributes: {
    user: {
      model: 'user',
      required: true,
    },
    token: {
      type: 'string',
      unique: true,
      required: true,
    },
  },
});
