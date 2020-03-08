export class Parser {
  private action = '';
  private topic = '';
  private msg = '';

  constructor(data: string) {
    try {
      // topic/message must start/end with single qoutes
      const parsed = /^(\S+)\s+['’](\S+)['’](\s+['’](.+)['’])?/.exec(data);
      this.action = parsed[1];
      this.topic = parsed[2];
      this.msg = parsed[4];
    } catch (err) {
      console.error('[ERR] Unable to parse socket data');
      console.error(err);
    }
  }

  // getters
  getAction(): string {
    return this.action;
  }

  getTopic(): string {
    return this.topic;
  }

  getMessage(): string {
    return this.msg;
  }
}
