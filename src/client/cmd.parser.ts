import { ActionType } from './cmd.action';

export default (line: string): { action: ActionType; options: string[] } => {
  const splited = line.split(' ');
  const action = splited[0];
  return { action, options: splited.slice(1) };
};
