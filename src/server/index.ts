console.log('Broker server starting...');
import net = require('net');
import { SocketData } from './data.parser';
import Subscriber from './subscriber';

const PORT = 5000;
const HOST = '0.0.0.0';

const server = net.createServer();

server.listen(PORT, HOST, () =>
  console.log('server start at ', server.address()),
);

server.on('connection', socket => {
  server.getConnections((err, n) => {
    console.log('number of connection', n);
  });

  socket.on('connect', () =>
    console.log(
      'client',
      socket.remoteAddress,
      socket.remoteFamily,
      socket.remotePort,
    ),
  );

  socket.on('data', data => {
    //   socket
    // console.log(socket.);
    console.log(socket.remoteAddress);
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
        console.log('number of connection after close', n);
      });
  });
  // console.log('on connection', socket.on('connect'))
});
