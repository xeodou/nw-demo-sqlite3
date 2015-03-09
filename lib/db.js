/*
 * db.js
 * Copyright(c) 2015-03-03 17:15:30 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */


function nw_sqlite(db) {

  var KEY = 'aa37ce9555c6c3136791';
  var TABLE_NAME = 'users';

  return {
    find: function (name, cb) {
      db.serialize(function () {
        db.run('PRAGMA key=' + KEY + ';');
        db.run('CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (id INTEGER PRIMARY KEY, name char, password chart, UNIQUE(name));')
        db.get('SELECT name, password FROM ' + TABLE_NAME + ' WHERE name=\'' + name + '\';', cb);
      });
      db.close();
    },

    create: function (name, password, cb) {
      db.serialize(function () {
        db.run('PRAGMA key=' + KEY + ';');
        db.run('CREATE TABLE IF NOT EXISTS ' + TABLE_NAME + ' (id INTEGER PRIMARY KEY, name char, password chart, UNIQUE(name));')

        db.run('INSERT INTO ' + TABLE_NAME + ' (name, password) values(?, ?)', [name, password], cb);

      });
      db.close();
    }
  }

}

if(typeof window === 'undefined') {
  module.exports = nw_sqlite
}
