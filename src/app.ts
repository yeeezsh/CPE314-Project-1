import * as readline from 'readline';
import { euei, eiei } from './interfaces/test.interface';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('', line => {
  console.log('input: ', line);
  rl.close();
});

const test = (s: eiei) => {
  console.log(s);
};

test({ msg: 'testja' });
