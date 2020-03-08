import * as net from 'net';

export default class Subscriber {
  static clients: Array<{ topic: string; socket: net.Socket }> = [];

  constructor(topic: string, socket: net.Socket) {
    Subscriber.clients.push({
      topic,
      socket,
    });
  }

  static publish(topic: string, msg: string) {
    Subscriber.clients
      .filter(client => client.topic === topic)
      .forEach(({ socket }) => {
        if (!socket.destroyed) {
          socket.write(topic + ' ' + msg);
        } else {
          console.warn(
            '[WARN] Adress :',
            socket.remoteAddress,
            `(${socket.remotePort})`,
            'has alread destroyed',
          );
          console.log('[CONN] removing destroyed socket');
          this.remove(socket);
        }
      });
  }

  static remove(s: net.Socket) {
    this.clients = this.clients.filter(f => f.socket !== s);
    return;
  }
}
