import net = require('net');
import readline = require('readline');
console.log('client ja');

const END_POINT = '127.0.0.1';
const PORT = 8080;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const mainCmd = (cb?: (s: any) => void) => {
  rl.question('client > ', line => {
    rl.emit('line');
    return cb && cb(line);
  });
};

rl.on('line', () => mainCmd());

const client = net.connect(PORT, END_POINT, () => {
  console.log('create connection to', END_POINT);
});

client.once('connect', () => {
  console.log('establish connection');
  //   mainCmd(s => console.log('command', s));
  mainCmd();
  //
  //   client.write('PUBLISH');
  //   client.end(() => console.log('end write'));
});

client.on('error', err => {
  console.log('error connection retrying');
  setTimeout(() => client.connect(PORT, END_POINT).setTimeout(500), 1000);
});

client.on('close', hadError => {
  if (hadError) return console.log('connection closed with error');
  return console.log('connection closed without error');
});

client.on('end', () => console.log('end connection'));
