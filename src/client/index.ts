import * as os from 'os';
import * as readline from 'readline';

import socketAction from './socket.action';
import { Parser } from './parser';
import { Line } from './line';
import { SocketBroker } from './socket.broker';

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

export const input = new Line();
const socketBroker = new SocketBroker();

input.onLine(async () => {
  const line = await input.question();
  const { action, options, target } = Parser.parse(line);
  await socketAction(PORT, target, action, socketBroker, ...options);
  input.initLine();
});

input.initLine();
