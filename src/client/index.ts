import * as net from 'net';
import * as os from 'os';

import readline = require('readline');
import cmdParser from './cmd.parser';
import cmdAction from './cmd.action';

const IPv4 = os.networkInterfaces()['en0'].filter(e => e.family === 'IPv4')[0]
  .address;
console.log('Hostname :', os.hostname());
console.log('Local IP :', IPv4, '\n');

const END_POINT = '127.0.0.1';
export const PORT = 5000;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const mainCmd = (cb?: (s: any) => void) => {
  rl.question('\nclient > ', line => {
    const { action, options } = cmdParser(line);
    const target = options[0];

    cmdAction(PORT, target, action, ...options).then(() => {
      rl.emit('line');
      return cb && cb(line);
    });
    // const client = net.connect(PORT, target).on('connect', () => {
    //   cmdAction(client, action, ...options);
    //   rl.emit('line');
    //   return cb && cb(line);
    // });
  });
};

rl.on('line', () => mainCmd());

mainCmd();
