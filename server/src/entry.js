import './flowWorkarounds';
import { onConnection } from './primus/connections';
import bcrypt from 'bcryptjs';
import bluebird from 'bluebird';
import http from 'http';
import koa from 'koa';
import koaJSON from 'koa-json-body';
import path from 'path';
import Primus from 'primus';
import Redis from 'redis';
import RedisSessions from 'redis-sessions';
import router from 'koa-66';
import UUID from 'uuid-js';

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);

global.encrypt = function(value) {
  return new Promise(resolve => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(value, salt, (err, hash) => {
        resolve(hash);
      });
    });
  });
};

bluebird.promisifyAll(RedisSessions.prototype);

UUID.create = function(old) {
  return function() {
    const uuid = old.apply(this, arguments);
    return uuid.hex;
  };
}(UUID.create);
require('pretty-error').start();

global.Promise = bluebird;

global.app = new koa();
const server = http.createServer(global.app.callback());
const options = {
  transformer: 'engine.io',
  compression: true,
};
global.router = new router();

global.primus = new Primus(server, options);
global.primus.use('emit', require('primus-emit'));
global.primus.use('rooms', require('primus-rooms'));

global.primus.on('connection', onConnection);

global.primus.save(path.resolve('./primusClient.js'));


require('./routes.js');

global.app
.use(koaJSON())
.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.error(e.stack);
    ctx.body = e;
    ctx.status = 500;
  }
})
.use(global.router.routes())
;

server.listen(9500);
