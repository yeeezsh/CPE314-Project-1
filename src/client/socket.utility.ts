import * as net from 'net';

export const connectToBroker = async (
  port: number,
  target: string,
): Promise<net.Socket> =>
  new Promise((resolve, reject) => {
    const socket = net.connect(port, target);
    socket.on('connect', () => resolve(socket));
    socket.on('error', () => reject());
  });
