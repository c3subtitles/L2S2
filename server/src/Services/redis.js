/* eslint camelcase: 0 */
/* @flow */
import RedisSessions from 'redis-sessions';
import redis from 'redis';
import { User } from '../models';

const redisOptions = {
  enable_offline_queue: false,
};
if (process.env.REDIS_PATH) {
  redisOptions.path = process.env.REDIS_PATH;
} else {
  redisOptions.host = process.env.REDIS_HOST;
  redisOptions.port = process.env.REDIS_PORT;
}
const redisClient = redis.createClient(redisOptions);
const app = 'L2S2-TEST';
const rs = new RedisSessions({
  client: redisClient,
});

export async function createSession(userId: number): Promise<string> {
  const result = await rs.createAsync({
    app,
    id: userId,
    ip: 'undefined',
    ttl: 3600,
  });
  return result.token;
}

export async function getUserForSessionFromRedis(token: string): Promise<?ClientUser> {
  const { id } = await rs.getAsync({
    app,
    token,
  });
  if (id) {
    return await User.findOne({ id }).populate('role');
  }
}

export async function deleteSession(token: string): Promise<void> {
  await rs.killAsync({
    app,
    token,
  });
}
