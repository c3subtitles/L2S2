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
      localStorage.removeItem('sessionId');
    }
    this._sessionId = value;
  }
  @observable user: User;
  constructor() {
    if (this.sessionId) {
      this.getUser();
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
}

export default new LoginService();
