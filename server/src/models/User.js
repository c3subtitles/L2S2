import Waterline from 'waterline';
import bcrypt from 'bcryptjs';

function encrypt(value) {
  return new Promise(resolve => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(value, salt, (err, hash) => {
        resolve(hash);
      });
    });
  });
}

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
    encrypt(values.password).then(password => {
      values.password = password;
      next();
    });
  },
  beforeUpdate(values, next) {
    if (values.password) {
      encrypt(values.password).then(password => {
        values.password = password;
        next();
      });
    }
  },
});
