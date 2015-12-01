/* eslint no-sync: 0 */
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import postgresAdapter from 'sails-postgresql';
import Waterline from 'waterline';

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

const config = {
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  url: process.env.DATABASE_URL,
  user: process.env.DATABASE_USERNAME,
};

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
  }, (e, orm: ?Object) => {
    if (e) {
      return;
    }
    _.each(orm.collections, (model, name: string) => {
      console.log(_.capitalize(name));
      global.models[_.capitalize(name)] = model;
    });
    resolve();
  });
})
.catch(e => {
  console.error(e.stack);
});

export default global.models;
