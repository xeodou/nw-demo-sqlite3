
import {Router} from 'express';

import DB from './db'

export default function user(options) {
    let route = Router();

    let db = new DB(options.go)

    route.get('/', function(req, res, next) {
      res.render('index')
    })

    route.post('/', function(req, res, next) {
      db.find(req.body.name, function(err, data) {
        if(err) {
          return res.render('error')
        }
        try {
          data = JSON.parse(data)
        } catch (err) {
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

      db.find(req.session.uid, function(err, data) {
        if(err) {
          return res.render('error')
        }
        try {
          data = JSON.parse(data)
        } catch (err) {
          return res.render('error')
        }
        res.render('user', data)
      })

    })

    route.get('/signup', function(req, res, next) {
      res.render('signup')
    })

    route.post('/signup', function (req, res, next) {
      db.create(req.body.name, req.body.pass, function (err, data) {
        if (err) {
          return res.render('error')
        }
        res.redirect('/')
      })
    })

    return route;
}
