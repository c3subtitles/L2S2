import Users from './Services/users';
import { User } from './models';

global.router.post('/api/login', function*() {
  const { username, password } = this.request.body;
  const { user, sessionId } = yield Users.login(username, password);
  if (user) {
    this.status = 200;
    this.body = {
      sessionId,
      user: Users.getClientUserRepresentation(user),
    };
  } else {
    this.status = 403;
  }
});

global.router.post('/api/userForSessionId', function*() {
  const { sessionId } = this.request.body;
  const user = yield Users.getUserForSessionId(sessionId);
  if (user) {
    this.body = Users.getClientUserRepresentation(user);
    this.status = 200;
  } else {
    this.status = 400;
  }
});

global.router.post('/api/logout', function() {
  const { sessionId } = this.request.body;
  Users.logout(sessionId);
  this.status = 200;
});

global.router.post('/api/changePassword', function*() {
  const { sessionId, oldPassword, newPassword } = this.request.body;
  try {
    const user = yield Users.getUserForSessionId(sessionId);
    if (user) {
      const correctOld = yield Users.checkPassword(oldPassword, user);
      if (!correctOld) {
        this.status = 400;
        return;
      }
      yield User.update({ id: user.id }, { password: newPassword });
      this.status = 200;
    } else {
      this.status = 400;
    }
  } catch (e) {
    console.error(e);
  }
});
