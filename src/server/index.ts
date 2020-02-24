console.log('server ja');
import net = require('net');

const PORT = 8080;

const server = net.createServer();

server.listen(PORT, () => console.log('server start at ', server.address()));

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
    console.log('on data', data.toString());
  });
  // console.log('on connection', socket.on('connect'))
});
