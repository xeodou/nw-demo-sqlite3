
import {Router} from 'express';
import sqlite3 from 'sqlite3';
import {resolve} from 'path';

if(typeof window === 'undefined') {
  // import nw_sqlite from './db'
  var nw_sqlite = require('./db')
} else {
  nw_sqlite = window.nw_sqlite
  console.log('running in nw runtime')
}

export default function user(options) {
    let route = Router();
    sqlite3 = sqlite3.verbose()

    route.get('/', function(req, res, next) {
      res.render('index')
    })

    route.post('/', function(req, res, next) {
      let db = new sqlite3.Database(resolve(__dirname, '..', options.go.db))
      nw_sqlite(db).find(req.body.name, function(err, data) {
        if(err) {
          return res.render('error')
        }
        if(data.password != req.body.pass)
          return res.send({status: 'password error'})
        req.session = req.session || {}
        req.session.uid = req.body.name
        res.redirect('/u/' + req.body.name)
      })
    })

    route.get('/u/:user', function(req, res, next) {

      if(!req.session || !req.session.uid) {
        return res.redirect('/');
      }
      let db = new sqlite3.Database(resolve(__dirname, '..', options.go.db))
      nw_sqlite(db).find(req.session.uid, function(err, data) {
        if(err) {
          return res.render('error')
        }
        res.render('user', data)
      })

    })

    route.get('/signup', function(req, res, next) {
      res.render('signup')
    })

    route.post('/signup', function (req, res, next) {
      let db = new sqlite3.Database(resolve(__dirname, '..', options.go.db))
      nw_sqlite(db).create(req.body.name, req.body.pass, function (err, data) {
        if (err) {
          return res.render('error')
        }
        res.redirect('/')
      })
    })

    return route;
}
