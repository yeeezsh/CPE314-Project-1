import * as net from 'net';
import { input, TIME_OUT } from '.';
import { Parser } from './parser';
import { socketBroker } from './index';

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
    return new Promise((resolve, _reject) => {
      const socket = net.connect(port, target);
      socket.setTimeout(TIME_OUT);

      socket.on('connect', () => {
        clearInterval(connecting);
        socket.setTimeout(0);
        console.log('\r[CONN] connected to ', target);
        console.log('[CONN] establish connection');
        resolve(socket);
      });

      socket.on('data', data => {
        // clearInterval(connecting);
        const { msg, topic } = Parser.parseMessage(data.toString());
        console.log('\r[MSG] Topic : ', topic, ' > ', msg);
        input.initLine();
      });

      socket.on('error', err => {
        clearInterval(connecting);
        console.log('\n');
        console.error('[ERR] ', err);
        socketBroker.removeSub(socket);
        input.initLine();
      });
      socket.on('timeout', () => {
        clearInterval(connecting);
        console.log('\n');
        console.log('[CONN] connection timeout');
        socketBroker.removeSub(socket);
        input.initLine();
      });
      socket.on('close', () => {
        console.log('\r[CONN] close connection');
        console.log('[SUB] removing sub connection');
        socketBroker.removeSub(socket);
        socketBroker.getSubscribeList();
        input.initLine();
      });

      const connecting = setInterval(() => {
        console.log('[CONN] connecting to ', target);
      }, 500);
    });
  }

  getSubscribeList() {
    console.log('[SUB] Number of connection ', this.list.length);
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

  removeSub(s: net.Socket) {
    const fileterd = this.list.filter(f => f.s !== s);
    s.destroy();
    this.list = fileterd;
  }
}
