import * as net from 'net';
import * as os from 'os';
import { Parser } from './parser';
import Subscriber from './subscriber';

const PORT = 5000;
const HOST = '0.0.0.0';
const MAX_CONN = 1000;

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

const server = net.createServer();
server.maxConnections = MAX_CONN;

console.log('Broker server starting...', '\n');
server.listen(PORT, HOST, () => {
  console.log('Broker Address');
  console.log('Hostname:', os.hostname());
  console.log('Local IP:', addresses);
  console.log('Port:', PORT);
  console.log('Maximum connection: ', server.maxConnections, '\n');
});

const subscriber = new Subscriber();
// after started broker
server.on('connection', socket => {
  // show number of total connection
  server.getConnections((err, n) => {
    console.log('[CONN] Number of connection', n, '/', server.maxConnections);
    if (err) console.error('[ERR]', err);
  });

  console.log(
    `[CONN] incomming from ${socket.remoteAddress}:`,
    socket.remotePort,
  );

  // data from remote
  socket.on('data', data => {
    console.log(
      `[CONN] incomming data from ${socket.remoteAddress}:`,
      socket.remotePort,
    );
    const parsed = new Parser(data.toString());

    if (parsed.isError()) {
      socket.write("'[ERR]' 'Unable to parse socket data'");
      return;
    }

    // parsed data from remote
    const topic = parsed.getTopic();
    const msg = parsed.getMessage();
    const action = parsed.getAction();
    switch (action) {
      case 'publish':
        subscriber.publish(topic, msg);
        console.log(`[PUB] from ${socket.remoteAddress}:`, socket.remotePort);
        console.log(`Topic: ${topic} | Msg: ${msg}`);
        break;
      case 'subscribe':
        subscriber.subscribe(topic, socket);
        console.log(`[SUB] from ${socket.remoteAddress}:`, socket.remotePort);
        console.log(`Topic: ${topic}`);
        break;
      default:
        console.error('[ERR] unrecognized action:', action);
    }
  });

  // on remote send close
  socket.on('close', () => {
    console.log(
      `[CONN] disconnected from ${socket.remoteAddress}:`,
      socket.remotePort,
    );

    server.getConnections((err, n) => {
      if (err) {
        console.log('[ERR] ', err);
      }
      console.log('[CONN] Number of connection', n, '/', server.maxConnections);
    });
    subscriber.remove(socket);
  });
  socket.on('error', () => {});
});
