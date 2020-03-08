import * as net from 'net';
import { input } from '.';
import { Parser } from './parser';

export interface SubSocket {
  ip: string;
  s: net.Socket;
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
      socket.on('connect', () => {
        console.log('[CONN] connected to ', target);
        console.log('[CONN] establish connection');
        resolve(socket);
      });

      socket.on('data', data => {
        const { msg, topic } = Parser.parseMessage(data.toString());
        console.log('\n[MSG] Topic : ', topic, ' > ', msg);
        input.initLine();
      });

      socket.on('error', err => {
        console.error(err);
        reject(err);
      });
      socket.on('timeout', () => {
        console.log('[CONN] connection timeout');
      });
      socket.on('close', err => {
        console.log('[CONN] close connection');
      });
    });
  }

  getSubscribeList() {
    this.list.forEach(e => console.log('[SUB] Address', e.ip));
  }

  addSub(ip: string, s: net.Socket) {
    console.log('[CONN] add persistence connection');
    this.list = [...this.list, { ip, s }];
    return;
  }

  getByTarget(ip: string): SubSocket {
    return this.list.filter(f => f.ip === ip)[0];
  }

  exist(ip: string): boolean {
    const ips = this.list.map(e => e.ip);
    if (ips.includes(ip)) return true;
    return false;
  }

  removeSub(s: net.Socket) {}
}

// export const brokerSubsrcibe = new BrokerSubsrcibe();
