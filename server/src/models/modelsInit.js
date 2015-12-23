/* eslint no-sync: 0 */
/* @flow */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import postgresAdapter from 'sails-postgresql';
import Waterline from 'waterline';

global.waterline = new Waterline();

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'modelsInit.js');
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default;
    global.waterline.loadCollection(model);
  });

global.models = {};

const config = {
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  url: process.env.DATABASE_URL,
  user: process.env.DATABASE_USERNAME,
};

export default global.models;


global.initPromise = new Promise(resolve => {
  global.waterline.initialize({
    adapters: {
      postgres: postgresAdapter,
    },
    connections: {
      default: {
        ...config,
        adapter: 'postgres',
      },
    },
  }, (e, orm) => {
    if (e) {
      throw e;
    }
    _.each(orm.collections, (model, name) => {
      global.models[_.capitalize(name)] = model;
    });
    resolve();
  });
})
.catch(e => {
  console.error(e.stack);
});
