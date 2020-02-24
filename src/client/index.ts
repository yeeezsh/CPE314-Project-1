import net = require('net');
import os = require('os');

import readline = require('readline');
import cmdParser from './cmd.parser';
import cmdAction from './cmd.action';

const IPv4 = os.networkInterfaces()['en0'].filter(e => e.family === 'IPv4')[0]
  .address;
console.log('Hostname :', os.hostname());
console.log('Local IP :', IPv4, '\n');

const END_POINT = '127.0.0.1';
export const PORT = 8080;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const mainCmd = (cb?: (s: any) => void) => {
  rl.question('\nclient > ', line => {
    const { action, options } = cmdParser(line);
    let client = undefined;
    const target = options[0];
    if (!client) client = net.connect(PORT, target);
    try {
      cmdAction(client, action, ...options);
    } catch (err) {
      throw err;
    }
    rl.emit('line');
    return cb && cb(line);
  });
};

// const client = net.connect(PORT, END_POINT, () =>
//   console.log('create connection to', END_POINT),
// );

rl.on('line', () => mainCmd());
try {
  mainCmd();
} catch (err) {
  console.log('retry');
  //   console.error(err);
  mainCmd();
}

// client.once('connect', () => {
//   console.log('establish connection');
//   mainCmd();
//   //
//   //   client.write('PUBLISH');
//   //   client.end(() => console.log('end write'));
// });

// client.on('close', () => console.log('on closed conn'));

// client.on('error', err => {
//   console.log('error connection retrying');
//   setTimeout(() => client.connect(PORT, END_POINT).setTimeout(500), 1000);
// });

// client.on('close', hadError => {
//   if (hadError) return console.log('connection closed with error');
//   return console.log('connection closed without error');
// });

// client.on('end', () => {
//   console.log('\n end connection');
// });
