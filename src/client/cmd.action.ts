import * as net from 'net';
import { connectToBroker } from './socket.utility';

const ON_SUB = false;
const MAX_RETRY = 3;
export type ActionType = 'publish' | 'subscribe' | string;
export default async (
  port: number,
  target: string,
  action: ActionType,
  ...options: any
) => {
  const topic = options[1];
  const msg = options[2];

  console.log('resting param', options);

  switch (action) {
    case 'publish':
      const socket = await connectToBroker(port, target);
      console.log('connected to ', target);
      console.log('establish connection');
      socket.write(topic + ' ' + msg);
      socket.end();
      console.log('close connection');

      return;
    case 'subscribe':
      console.log('subscribe action');
      return;

    default:
      console.error('undefined action');
      return;
    // throw new Error('undefined token');
  }
};
