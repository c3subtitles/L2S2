/* eslint no-sync: 0 */


import postgresAdapter from 'waterline-postgresql';
import Waterline from 'waterline';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

global.waterline = new Waterline();

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    global.waterline.loadCollection(model);
  });

global.models = {};
export default global.models;

global.initPromise = new Promise(resolve => {
  global.waterline.initialize({
    adapters: {
      postgres: postgresAdapter,
    },
    connections: {
      default: {
        connection: process.env.DATABASE_URL,
        adapter: 'postgres',
      },
    },
  }, (e, orm) => {
    _.each(orm.collections, (model, name) => {
      global.models[_.capitalize(name)] = model;
    });
    resolve();
  });
});
