import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'room',
  connection: 'default',
  attributes: {
    name: 'string',
    locked: { type: 'boolean', required: true, defaultsTo: false },
    speechLocked: { type: 'boolean', required: true, defaultsTo: false },
  },
});
