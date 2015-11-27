import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'line',
  connection: 'default',
  attributes: {
    text: 'string',
    user: {
      model: 'user',
    },
    room: {
      model: 'room',
    },
    roomName: 'string',
  },
});
