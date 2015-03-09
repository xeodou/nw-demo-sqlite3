
// Their code
import express from 'express';
import {Server as http } from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';
import { resolve } from 'path';

// Our code
import user from './user';
import config from '../config.json'

export default {

  start(cb) {
    let app = express();
    let srv = http(app);
    let node_env = process.env.NODE_ENV || 'prod';

    app.set('views', resolve(__dirname, '../public'));
    app.set('view engine', 'jade');

    app.use(cookieParser());
    app.use(session({ secret: 'secret key' }));
    app.use(bodyParser());
    app.use(express.static(resolve(__dirname, '../public')));

    app.use(user(config));

    if (node_env === 'dev' || node_env === 'development') {
      return srv.listen(4000, '127.0.0.1', function () {
        console.log('server running in ', srv.address().port)
      })
    }

    srv.listen(0, '127.0.0.1', 1, function () {
      var port = srv.address().port;
      console.log('server running in ' + port)
      if(cb) cb(port)
    })
  }
}
