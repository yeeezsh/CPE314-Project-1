import * as os from 'os';

import readline = require('readline');
import cmdAction from './cmd.action';
import { Parser } from './parser';
import { Line } from './line';
import { SocketBroker } from './socket.utility';

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

export const PORT = 5000;

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const input = new Line();
const socketBroker = new SocketBroker();

input.onLine(async () => {
  const line = await input.question();
  const { action, options, target } = Parser.parse(line);
  await cmdAction(PORT, target, action, socketBroker, ...options);
});

input.initLine();
