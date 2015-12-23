import '../../babelHelper';
import 'babel-regenerator-runtime';
import './models/modelsInit';
if (process.env.NODE_ENV !== 'production') {
  require('pretty-error').start();
}
global.initPromise.then(() => {
  require('./app');
});
