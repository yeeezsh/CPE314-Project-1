import net = require('net');
console.log('client ja');

const END_POINT = '127.0.0.1';
const PORT = 8080;

// net.connect(END_POINT, () => console.log('connecting to ', END_POINT));
// const connect = net.connect(PORT, END_POINT);
const client = net.connect(PORT, END_POINT, () => {
  console.log('create connection to', END_POINT);
});

client.once('connect', () => {
  console.log('establish connection');
  client.write('PUBLISH');
  client.end(() => console.log('end write'));
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
