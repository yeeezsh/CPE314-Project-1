console.log('Broker server starting...', '\n');
import * as net from 'net';
import * as os from 'os';
import { SocketData } from './data.parser';
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

server.listen(PORT, HOST, () => {
  console.log('Broker Adress');
  console.log('Hostname:', os.hostname());
  console.log('Local IP:', addresses);
  console.log('Port:', PORT);
  console.log('Maximun connection: ', server.maxConnections, '\n');
});

// after started broker
server.on('connection', socket => {
  // show number of total connection
  server.getConnections((err, n) => {
    console.log('[CONN] number of connection', n, '/', server.maxConnections);
    if (err) console.error('[ERR]', err);
  });

  console.log(
    `[CONN] inconmming from ${socket.remoteAddress}:`,
    socket.remotePort,
  );

  // data from remote
  socket.on('data', data => {
    console.log(
      `[CONN] incomming data from ${socket.remoteAddress}:`,
      socket.remotePort,
    );
    const parsed = new SocketData(data.toString());

    /* quick handle */
    const topic = parsed.getTopic();
    const msg = parsed.getMessage();
    const action = parsed.getAction();
    switch (action) {
      case 'publish':
        Subscriber.publish(topic, msg);
        console.log(`[PUB] from ${socket.remoteAddress}:`, socket.remotePort);
        console.log(`Topic: ${topic} | Msg: ${msg}`);
        break;
      case 'subscribe':
        new Subscriber(topic, socket);
        console.log(`[SUB] from ${socket.remoteAddress}:`, socket.remotePort);
        console.log(`Topic: ${topic}`);
        break;
      default:
        console.error('[ERR] unrecognized action:', action);
    }
  });

  socket.on('close', () => {
    console.log(
      `[CONN] disconnected from ${socket.remoteAddress}:`,
      socket.remotePort,
    );

    server.getConnections((err, n) => {
      if (err) {
        console.log('[ERR] ', err);
      }
      console.log('[CONN] number of connection', n, '/', server.maxConnections);
    });
    Subscriber.remove(socket);
  });
  // console.log('on connection', socket.on('connect'))
});
