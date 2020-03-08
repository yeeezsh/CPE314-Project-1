import * as net from 'net';
import { rl } from './';

export const connectToBroker = async (
  port: number,
  target: string,
): Promise<net.Socket> =>
  new Promise((resolve, reject) => {
    const socket = net.connect(port, target);
    socket.on('connect', () => resolve(socket));
    socket.on('data', data => {
      console.log('data: ', data.toString());
      rl.emit('line');
    });
    socket.on('error', err => reject(err));
    socket.on('close', err => {
      // socket.connect(port, target);
      console.log('[DEBUG] connection closed');
    });
  });

export interface SubSocket {
  ip: string;
  s: net.Socket;
  topic: string;
}
type SocketList = SubSocket[];
export class SocketBroker {
  list: SocketList;
  constructor() {
    this.list = [];
  }

  async connect(port: number, target: string): Promise<net.Socket> {
    return new Promise((resolve, reject) => {
      const socket = net.connect(port, target);
      socket.on('connect', () => resolve(socket));
      socket.on('data', data => {
        console.log('data: ', data.toString());
        rl.emit('line');
      });
      socket.on('error', err => reject(err));
      socket.on('close', err => {
        // socket.connect(port, target);
        console.log('[DEBUG] connection closed');
      });
    });
  }

  getSubscribeList() {
    this.list.forEach(e =>
      console.log('[SUB] Address', e.ip, ' | ', 'Topic', e.topic),
    );
  }

  addSub(ip: string, s: net.Socket, topic: string) {
    this.list.push({ ip, s, topic });
    return;
  }

  getByIp(ip: string): SubSocket {
    return this.list.filter(f => f.ip === ip)[0];
  }

  exist(ip: string): boolean {
    const ips = this.list.map(e => e.ip);
    if (ips.includes(ip)) return true;
    return false;
  }
}

// export const brokerSubsrcibe = new BrokerSubsrcibe();
