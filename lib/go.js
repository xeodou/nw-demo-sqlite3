/*
* go.js
* Copyright(c) 2015-03-03 17:17:31 xeodou <xeodou@gmail.com>
* MIT Licensed
*/
import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import {resolve } from 'path';

export default class Go extends EventEmitter{

  constructor(options) {
    this.options = options
  }

  run(args=[], cb) {

    let bin = resolve(__dirname, '..', this.options.bin);

    if (/win[0-9][0-9]/.test(process.platform)) {
      bin += '.exe'
    }

    console.log(bin, args, {
      env: {
        NW_SQLITE_DATABASE: this.options.db
      }
    })

    let p = spawn(bin, args, {
      env: {
        NW_SQLITE_DATABASE: this.options.db
      }
    })
    let stdout, stderr;
    stdout = stderr = '';

    p.stdout.on('data', function(data) {
      stdout += data
    })

    p.stderr.on('data', function(data) {
      stderr += data
    })

    p.on('close', function(code) {
      console.error('child error: ' + code);
      if(code != 0)
        return cb(new Error(stderr))
      return cb(null, stdout)
    })

  }

}
