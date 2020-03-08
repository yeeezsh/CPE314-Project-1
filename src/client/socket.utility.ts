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

interface SubSocket {
  ip: string;
  s: net.Socket;
}
type SocketList = SubSocket[];
class BrokerSubsrcibe {
  list: SocketList;
  constructor() {
    this.list = [];
  }

  addSub(ip: string, s: net.Socket) {
    this.list.push({ ip, s });
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

export const brokerSubsrcibe = new BrokerSubsrcibe();
