import { Socket } from 'net';
import { PORT } from '.';

const ON_SUB = false;
const MAX_RETRY = 3;
export type ActionType = 'publish' | 'subscribe' | string;
export default (socket: Socket, s: ActionType, ...options: string[]) => {
  let currentRetry = 0;
  const targetIp = options[0];

  // socket.setTimeout(2000);
  // socket.on('close', () => console.log('on close'));

  // socket.on('error', err => {
  //   console.log('connecting...');
  //   // setTimeout(() => {
  //   //   currentRetry++;
  //   //   socket.connect(PORT, targetIp, );
  //   //   if (currentRetry > MAX_RETRY) {
  //   //     socket.end();
  //   //     throw `cannot connect to ${targetIp}`;
  //   //   }
  //   // }, 1000);
  // });

  // socket.on('error', e => {
  //   socket.setTimeout(1000, () => {
  //     socket.connect(PORT, targetIp);
  //   });
  //   console.log('retry');
  // });

  // if (!ON_SUB) {
  //   socket.connect(PORT, targetIp, () =>
  //     console.log('connected to ', targetIp),
  //   );
  // }

  console.log('resting param', options);

  switch (s) {
    case 'publish':
      // socket.connect(PORT, targetIp, () => {
      console.log('connected to ', targetIp);
      console.log('establish connection');
      socket.write('write ja');
      socket.end();
      // socket.end(() => console.log('closed connection'));
      // });

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
