import * as net from 'net';

export default class Subscriber {
  static clients = [];

  constructor(topic: string, socket: net.Socket) {
    Subscriber.clients.push({
      topic,
      socket,
    });
  }

  static publish(topic: string, msg: string) {
    Subscriber.clients
      .filter(client => client.topic === topic)
      .forEach(({ socket }) => socket.write(topic + ' ' + msg));
  }
}
