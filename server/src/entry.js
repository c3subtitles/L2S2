/* @flow */

import http from 'http';
import koa from 'koa';
import Primus from 'primus';
import bluebird from 'bluebird';
import path from 'path';
import router from 'koa-66';
import koaJSON from 'koa-json-body';
import UUID from 'uuid-js';

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

global.primus.save(path.resolve('./src/primusClient.js'));

require('./routes.js');

global.app
.use(koaJSON())
.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    ctx.body = e;
    ctx.status = 500;
  }
})
.use(global.router.routes())
;

server.listen(9500);
