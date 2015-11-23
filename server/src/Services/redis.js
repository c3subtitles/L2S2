import RedisSessions from 'redis-sessions';
import { User } from '../models';

const app = 'L2S2';
const rs = new RedisSessions({
  options: {
    path: process.env.REDIS_PATH,
    url: process.env.REDIS_URL,
  },
});

export async function createSession(userId: number) {
  const result = await rs.createAsync({
    app,
    id: userId,
    ip: 'undefined',
    ttl: 3600,
  });
  return result.token;
}

export async function getUserForSessionFromRedis(token: string) {
  const { id } = await rs.getAsync({
    app,
    token,
  });
  if (id) {
    return await User.findOne({ id }).populate('role');
  }
}

export async function deleteSession(token: string) {
  await rs.killAsync({
    app,
    token,
  });
}
