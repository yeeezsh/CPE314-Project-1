import * as net from 'net';
import * as os from 'os';

import readline = require('readline');
import cmdAction from './cmd.action';
import { Parser } from './parser';

const networkInterfaces = os.networkInterfaces();
const addresses = Object.keys(networkInterfaces)
  .map(el =>
    networkInterfaces[el].find(
      ({ family, internal }) => !internal && family === 'IPv4',
    ),
  )
  .filter(el => el)
  .map(({ address }) => address)
  .join(', ');
console.log('Hostname :', os.hostname());
console.log('Local IP :', addresses, '\n');

const END_POINT = '127.0.0.1';
export const PORT = 5000;

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const mainCmd = (cb?: (s: any) => void) => {
  rl.question('\nclient > ', line => {
    const { action, options } = Parser.parse(line);
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
