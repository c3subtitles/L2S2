// @flow
import axios from 'axios';

export async function login(username: string, password: string) {
  const r = await axios.post('/api/login', {
    username,
    password,
  });
  console.log(r);
  return r;
}
