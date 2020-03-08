import { ActionType } from './interfaces/action.type';

export class Parser {
  static parse(line: string): { action: ActionType; options: string[] } {
    const splited = line.split(/\s+/);
    const action = splited[0];
    return { action, options: splited.slice(1) };
  }
}
