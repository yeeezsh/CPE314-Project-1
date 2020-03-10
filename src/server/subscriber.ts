import * as net from 'net';

export default class Subscriber {
  clients: Array<{ topic: string; socket: net.Socket }> = [];

  constructor() {
    this.clients = [];
  }

  subscribe(topic: string, socket: net.Socket) {
    this.clients.push({ topic, socket: socket });
    socket.on('close', () => {
      this.remove(socket);
    });
  }

  publish(topic: string, msg: string) {
    this.clients
      .filter(client => client.topic === topic)
      .forEach(({ socket }) => {
        if (!socket.destroyed) {
          socket.write(`'${topic}' '${msg}'`);
        } else {
          console.warn(
            '[WARN] Address: ',
            socket.remoteAddress,
            ':',
            socket.remotePort,
            'has already destroyed',
          );
          console.log('[CONN] removing destroyed socket');
          this.remove(socket);
        }
      });
  }

  remove(s: net.Socket) {
    this.clients = this.clients.filter(f => f.socket !== s);
    s.destroy();
    return;
  }
}
