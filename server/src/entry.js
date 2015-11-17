/* @flow */

import http from 'http';
import koa from 'koa';
import Primus from 'primus';
import bluebird from 'bluebird';
import path from 'path';
import router from 'koa-router';
import koaBody from 'koa-body';
import UUID from 'uuid-js';

UUID.create = function(old) {
  return function() {
    const uuid = old.apply(this, arguments);
    return uuid.hex;
  };
}(UUID.create);
require('pretty-error').start();

global.Promise = bluebird;

global.app = koa();
const server = http.createServer(global.app.callback());
const options = {
  transformer: 'engine.io',
  compression: true,
};
global.router = router();

global.primus = new Primus(server, options);
global.primus.use('emit', require('primus-emit'));

global.primus.save(path.resolve('./src/primusClient.js'));

require('./routes.js');

global.app.use(koaBody()).use(global.router.routes());

server.listen(9500);
