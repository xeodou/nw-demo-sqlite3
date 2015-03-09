/*
 * db.js
 * Copyright(c) 2015-03-03 17:15:30 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

import Go from './go'

export default class User {

  constructor (options) {
    this.go = new Go(options)
  }

  find(name, cb) {
    this.go.run(['find', '-n', name], cb)
  }

  create(name, password, cb) {
    this.go.run(['create', '-n', name, '-p', password], cb)
  }

}
