import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'temporaryvoice',
  connection: 'default',
  attributes: {
    room: {
      model: 'room',
    },
    user: {
      model: 'user',
    },
  },
});
