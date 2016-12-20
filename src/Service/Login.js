// @flow
import axios from 'axios';
import { observable, computed } from 'mobx';

class LoginService {
  @observable _sessionId: ?string = localStorage.getItem('sessionId');
  get sessionId(): ?string {
    return this._sessionId;
  }
  set sessionId(value: ?string) {
    if (value) {
      localStorage.setItem('sessionId', value);
    } else {
      // $FlowFixMe
      this.user = null;
      localStorage.removeItem('sessionId');
    }
    this._sessionId = value;
  }
  @observable user: User;
  initPromise = Promise.resolve();
  constructor() {
    if (this.sessionId) {
      this.initPromise = this.getUser().catch(() => {});
    }
  }
  @computed
  get loggedIn(): bool {
    return Boolean(this.sessionId && this.user);
  }
  async login(username: string, password: string) {
    const { sessionId, user } = (await axios.post('/api/login', {
      username,
      password,
    })).data;
    this.user = user;
    this.sessionId = sessionId;
  }
  async getUser() {
    const user = (await axios.post('/api/userForSessionId')).data;
    this.user = user;
  }
  async register(username: string, password: string, email: string) {
    await axios.post('/api/register', {
      username,
      password,
      email,
    });
  }
  async resetPassword(email: string) {
    await axios.post('/api/users/resetPassword', {
      email,
    });
  }
  hasPermission(permission: string|string[]) {
    if (!this.loggedIn) {
      return false;
    }
    if (!permission.length) {
      return true;
    }
    const permissions = Array.isArray(permission) ? permission : [permission];
    return permissions.some(p => this.user.role[p]);
  }
  logout() {
    axios.post('/api/logout');
    this.sessionId = null;
    // $FlowFixMe
    this.user = null;
  }
}

export default new LoginService();
