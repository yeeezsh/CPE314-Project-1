// import { connectToBroker, brokerSubsrcibe } from './socket.utility';
import { Parser } from './parser';
import { SocketBroker } from './socket.utility';

// const socketBroker = new SocketBroker();

const ON_SUB = false;
const MAX_RETRY = 3;
export type ActionType = 'publish' | 'subscribe' | string;

export default async (
  port: number,
  target: string,
  action: ActionType,
  socketBroker: SocketBroker,
  ...options: string[]
) => {
  const { topic, msg } = Parser.parseOption(options);

  // check target is already subsrcibe before sending topic/msg
  const alreadySocket = socketBroker.exist(target);

  // establish conn w/ check if socket is already exist use in list instead
  const socket =
    (socketBroker.getByIp(target) && socketBroker.getByIp(target).s) ||
    (await socketBroker.connect(port, target));
  switch (action) {
    case 'publish':
      if (!alreadySocket) {
        console.log('[CONN] connected to ', target);
        console.log('[CONN] establish connection');
      }
      socket.write(action + ' ' + topic + ' ' + msg);
      console.log(
        '[MSG] Target : ',
        target,
        ' | ',
        'Topic ',
        topic,
        ' | ',
        'Message ',
        msg,
      );
      if (!alreadySocket) {
        console.log('[CONN] close connection');
        socket.end();
        return;
      }

      return;
    case 'subscribe':
      if (!alreadySocket) {
        socketBroker.addSub(target, socket, topic);
        console.log('[CONN] add persistence connection');
        socketBroker.getSubscribeList();
        return;
      }

      // socket.write(action + ' ' + topic);
      console.log('[SUB] Target : ', target, ' | ', 'Topic ', topic, ' | ');
      socket.write(action + ' ' + topic + ' ' + msg);

      // console.log('already socket', alreadySocket);
      // console.log('subscribe action');
      return;

    default:
      console.error('undefined action');
      return;
    // throw new Error('undefined token');
  }
};
