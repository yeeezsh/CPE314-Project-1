import * as net from 'net';
import { connectToBroker, brokerSubsrcibe } from './socket.utility';

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

  const alreadySocket = brokerSubsrcibe.exist(target);
  switch (action) {
    case 'publish':
      // check target is already subsrcibe before sending topic/msg
      const socket =
        (brokerSubsrcibe.getByIp(target) &&
          brokerSubsrcibe.getByIp(target).s) ||
        (await connectToBroker(port, target));

      console.log('connected to ', target);
      console.log('establish connection');
      socket.write(topic + ' ' + msg);
      if (!alreadySocket) {
        console.log('close connection');
        return socket.end();
      }

      return;
    case 'subscribe':
      if (!alreadySocket) {
        const socket = await connectToBroker(port, target);
        brokerSubsrcibe.addSub(target, socket);
        console.log('add new socket');
      }
      console.log('already socket', alreadySocket);
      console.log('subscribe action');
      return;

    default:
      console.error('undefined action');
      return;
    // throw new Error('undefined token');
  }
};
