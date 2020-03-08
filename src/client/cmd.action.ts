import { connectToBroker, brokerSubsrcibe } from './socket.utility';
import { Parser } from './parser';

const ON_SUB = false;
const MAX_RETRY = 3;
export type ActionType = 'publish' | 'subscribe' | string;
export default async (
  port: number,
  target: string,
  action: ActionType,
  ...options: string[]
) => {
  const { topic, msg } = Parser.parseOption(options);

  // check target is already subsrcibe before sending topic/msg
  const alreadySocket = brokerSubsrcibe.exist(target);

  // establish conn w/ check if socket is already exist use in list instead
  const socket =
    (brokerSubsrcibe.getByIp(target) && brokerSubsrcibe.getByIp(target).s) ||
    (await connectToBroker(port, target));
  switch (action) {
    case 'publish':
      console.log('[CONN] connected to ', target);
      console.log('[CONN] establish connection');
      socket.write(action + ' ' + topic + ' ' + msg);
      if (!alreadySocket) {
        console.log('[CONN] close connection');
        return socket.end();
      }

      return;
    case 'subscribe':
      if (!alreadySocket) {
        brokerSubsrcibe.addSub(target, socket);
        console.log('add new presist socket');
      }

      // socket.write(action + ' ' + topic);
      socket.write(action + ' ' + topic + ' ' + msg);

      // console.log('already socket', alreadySocket);
      console.log('subscribe action');
      return;

    default:
      console.error('undefined action');
      return;
    // throw new Error('undefined token');
  }
};
