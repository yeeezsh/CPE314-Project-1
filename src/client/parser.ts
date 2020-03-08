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
    const parsed = /(['’]\S+['’])\s*(['’](.+)['’])?/.exec(options.join(' '));
    if (!parsed) {
      console.error('\r[ERR]', 'Unable to parse topic or message');
      return { topic: '', msg: '' };
    }
    const topic = parsed[1];
    const msg = parsed[2];
    return { topic, msg };
  }

  static parseMessage(msg: string): { topic: string; msg: string } {
    const parsed = /(['’]\S+['’])\s*(['’](.+)['’])?/.exec(msg);
    return parsed
      ? {
          topic: parsed[1],
          msg: parsed[2].trim(),
        }
      : {
          topic: '[ERR]',
          msg: msg,
        };
  }
}
