console.log('server ja');
import net = require('net');
import { SocketData } from './data.parser';

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
    const test = new SocketData('publish ' + data.toString());
    console.log('on data', test.getMessage());
    console.log('topic:', test.getTopic());
  });

  socket.on('close', () => {
    console.log('client on close', socket.address()),
      server.getConnections((err, n) => {
        console.log('number of connection after close', n);
      });
  });
  // console.log('on connection', socket.on('connect'))
});
