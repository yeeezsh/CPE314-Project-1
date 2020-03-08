import { ActionType } from './interfaces/action.type';

export class Parser {
  static parse(line: string): { action: ActionType; options: string[] } {
    const splited = line.split(/\s+/);
    const action = splited[0];
    return { action, options: splited.slice(1) };
  }

  static parseOption(
    options: string[],
  ): {
    topic: string;
    msg: string;
  } {
    console.log('kskldkslds', options);
    const topic = options[1];
    const msg = options[2];
    return { topic, msg };
  }
}
