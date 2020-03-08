// import { connectToBroker, brokerSubsrcibe } from './socket.utility';
import { Parser } from './parser';
import { SocketBroker } from './socket.broker';

const ON_SUB = false;
const MAX_RETRY = 3;
export type ActionType = 'publish' | 'subscribe' | string;
const COMMAND_LIST = ['publish', 'subscribe'];

export default async (
  port: number,
  target: string,
  action: ActionType,
  socketBroker: SocketBroker,
  ...options: string[]
) => {
  if (!COMMAND_LIST.includes(action)) return;
  const { topic, msg } = Parser.parseOption(options);

  // check target is already subsrcibe before sending topic/msg
  const alreadySocket = socketBroker.exist(target);
  // establish conn w/ check if socket is already exist use in list instead
  const socket = alreadySocket
    ? socketBroker.getByTarget(target).s
    : await socketBroker.connect(port, target);
  console.log('already socket', alreadySocket);
  switch (action) {
    case 'publish':
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
        socket.end();
        return;
      }

      return;
    case 'subscribe':
      if (!alreadySocket) {
        socketBroker.addSub(target, socket);
        socketBroker.getSubscribeList();
      }

      console.log('[SUB] Target : ', target, ' | ', 'Topic ', topic, ' | ');
      socket.write(action + ' ' + topic + ' ' + msg);
      return;

    default:
      console.error('undefined action');
      return;
  }
};
