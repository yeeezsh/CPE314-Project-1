import { ActionType } from './interfaces/action.type';

export class Parser {
  static parse(
    line: string,
  ): { target: string; action: ActionType; options: string[] } {
    const splited = line.split(/\s+/);
    return {
      target: splited[1],
      action: splited[0],
      options: splited.slice(1),
    };
  }

  static parseOption(
    options: string[],
  ): {
    topic: string;
    msg: string;
  } {
    const topic = options[1];
    const msg = options[2];
    return { topic, msg };
  }
}
