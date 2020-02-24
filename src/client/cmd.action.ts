import { Socket } from 'net';
import { PORT } from '.';

const ON_SUB = false;
const MAX_RETRY = 2;
export type ActionType = 'publish' | 'subscribe' | string;
export default (socket: Socket, s: ActionType, ...options: string[]) => {
  let currentRetry = 0;
  const targetIp = options[0];

  socket.on('error', err => {
    console.log('connecting...');
    setTimeout(() => {
      currentRetry++;
      if (currentRetry <= MAX_RETRY) {
        socket.connect(PORT, targetIp).setTimeout(1000);
      } else {
        throw `cannot connect to ${targetIp}`;
      }
    }, 1000);
  });

  // if (!ON_SUB) {
  //   socket.connect(PORT, targetIp, () =>
  //     console.log('connected to ', targetIp),
  //   );
  // }

  console.log('resting param', options);
  switch (s) {
    case 'publish':
      socket.connect(PORT, targetIp, () => {
        console.log('connected to ', targetIp);
        socket.write('write ja');
        socket.end(() => console.log('closed connection'));
      });
      console.log('end conn');
      console.log('publish action');
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
