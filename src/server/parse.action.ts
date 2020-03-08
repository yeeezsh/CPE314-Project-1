// SCHEMA
// ACTION TOPIC MSG
export default (msg: string): 'publish' | 'subscribe' => {
  const parse = msg.split(' ');
  const action = parse[0];
  if (action === 'publish') return 'publish';
  if (action === 'subscribe') return 'subscribe';
  throw new Error('invalid msg parser');
};
