import Waterline from 'waterline';

export default Waterline.Collection.extend({
  identity: 'role',
  connection: 'default',
  attributes: {
    name: { type: 'string', unique: true, required: true },
    canActivateUser: { type: 'boolean', required: true, defaultsTo: false },
    canCreateRoom: { type: 'boolean', required: true, defaultsTo: false },
    canCreateUser: { type: 'boolean', required: true, defaultsTo: false },
    canDeleteRoom: { type: 'boolean', required: true, defaultsTo: false },
    canDeleteUser: { type: 'boolean', required: true, defaultsTo: false },
    canJoinLocked: { type: 'boolean', required: true, defaultsTo: false },
    canLock: { type: 'boolean', required: true, defaultsTo: false },
    canSpeechLock: { type: 'boolean', required: true, defaultsTo: false },
    toJSON() {
      const role = this.toObject();
      delete role.id;
      delete role.createdAt;
      delete role.updatedAt;
      return role;
    },
  },
});
