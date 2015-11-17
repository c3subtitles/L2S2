import { Role, User } from '../models';
import _ from 'lodash';

global.initPromise.then(() => {

  async function createRoles() {
    return await* [
      Role.findOrCreate({ name: 'Admin' }, {
        name: 'admin',
        canActivateUser: true,
        canCreateRoom: true,
        canCreateUser: true,
        canDeleteRoom: true,
        canDeleteUser: true,
        canJoinLocked: true,
        canJoinSpeechLocked: true,
        canLock: true,
        canSpeechLock: true,
      }),
      Role.findOrCreate({ name: 'Speech Recognition' }, {
        name: 'Speech Recognition',
        canJoinSpeechLocked: true,
        canSpeechLock: true,
      }),
      Role.findOrCreate({ name: 'Angel Mod' }, {
        name: 'Angel Mod',
        canActivateUser: true,
        canCreateUser: true,
      }),
      Role.findOrCreate({ name: 'User' }, {
        name: 'User',
      }),
    ];
  }

  async function createAdmin(roles) {
    const adminRole = _.find(roles, { name: 'admin' });
    return await User.findOrCreate({ username: 'admin' }, {
      username: 'admin',
      password: 'admin',
      active: true,
      role: adminRole.id,
    });
  }

  createRoles().then(createAdmin).then(() => {
    process.exit(0);
  });
});
