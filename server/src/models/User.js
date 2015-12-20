import Waterline from 'waterline';
import { getClientUserRepresentation } from '../Services/users';

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
    canBan: {
      type: 'boolean',
      defaultsTo: false,
    },
    client() {
      return getClientUserRepresentation(this);
    },
    toJSON() {
      const user = this.toObject();
      delete user.createdAt;
      delete user.updatedAt;
      delete user.password;
      return user;
    },
  },
  beforeCreate(values, next) {
    global.encrypt(values.password).then(password => {
      values.password = password;
      next();
    });
  },
});
