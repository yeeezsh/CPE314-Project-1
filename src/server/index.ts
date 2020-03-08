console.log('Broker server starting...', '\n');
import * as net from 'net';
import * as os from 'os';
import { SocketData } from './data.parser';
import Subscriber from './subscriber';

const PORT = 5000;
const HOST = '0.0.0.0';

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

// welcome socket
const server = net.createServer();

server.listen(PORT, HOST, () => {
  console.log('Broker Adress');
  console.log('Hostname :', os.hostname());
  console.log('Local IP :', addresses);
  console.log('Port :', PORT, '\n');
});

// welcome event
server.on('connection', socket => {
  server.getConnections((err, n) => {
    console.log('[CONN] number of connection', n);
  });

  console.log(
    '[CONN] inncoming from ',
    socket.remoteAddress,
    ':',
    socket.remotePort,
  );

  // socket.on('connect', () => {
  //   console.log('[CONN] connection establish');
  // });

  socket.on('data', data => {
    console.log(
      '[CONN] incomming data from ',
      socket.remoteAddress,
      ':',
      socket.remotePort,
    );
    const parsed = new SocketData(data.toString());

    /* quick handle */
    switch (parsed.getAction()) {
      case 'publish':
        Subscriber.publish(parsed.getTopic(), parsed.getMessage());
        break;
      case 'subscribe':
        new Subscriber(parsed.getTopic(), socket);
        break;
      default:
        console.error('unrecognized action:', parsed.getAction());
    }

    console.log('on data', parsed.getMessage());
    console.log('topic:', parsed.getTopic());
  });

  socket.on('close', () => {
    console.log('client on close', socket.address()),
      server.getConnections((err, n) => {
        if (err) {
          console.log('[ERR] ', err);
        }
        console.log('[CONN] number of connection', n);
      });
    socket.destroy();
  });
  // console.log('on connection', socket.on('connect'))
});
