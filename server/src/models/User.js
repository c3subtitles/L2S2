import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    username: {
      type: 'string',
      unique: true,
    },
    password: 'string',
    email: 'string',
    active: {
      type: 'boolean',
      required: true,
      defaultsTo: false,
    },
    role: {
      model: 'role',
    },
  },
  beforeCreate(values, next) {
    global.encrypt(values.password).then(password => {
      values.password = password;
      next();
    });
  },
});
