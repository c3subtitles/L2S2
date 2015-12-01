import './flowWorkarounds';
import bcrypt from 'bcryptjs';
import bluebird from 'bluebird';
import fs from 'fs';
import http from 'http';
import https from 'https';
import koa from 'koa';
import koaJSON from 'koa-json-body';
import path from 'path';
import Primus from 'primus';
import RedisSessions from 'redis-sessions';
import router from 'koa-66';
import UUID from 'uuid-js';

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
let server;
if (process.env.SSLKEY && process.env.SSLCERT) {
  /* eslint-disable no-sync */
  server = https.createServer({
    key: fs.readFileSync(process.env.SSLKEY),
    cert: fs.readFileSync(process.env.SSLCERT),
  }, global.app.callback());
  /* eslint-enable no-sync */
} else {
  server = http.createServer(global.app.callback());
}
const options = {
  transformer: 'engine.io',
  compression: true,
};
global.router = new router();

global.primus = new Primus(server, options);
global.primus.use('emit', require('primus-emit'));
global.primus.use('rooms', require('primus-rooms'));

global.primus.on('connection', require('./primus/connections').onConnection);

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

server.listen(process.env.PORT || 9500);
