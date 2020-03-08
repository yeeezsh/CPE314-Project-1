import * as os from 'os';

import readline = require('readline');
import cmdAction from './cmd.action';
import { Parser } from './parser';
import { Line } from './line';

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

input.onLine(async () => {
  const line = await input.question();
  const { action, options } = Parser.parse(line);
  const target = options[0];
  await cmdAction(PORT, target, action, ...options);
});

input.initLine();
