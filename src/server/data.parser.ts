export class SocketData {
  private action = '';
  private topic = '';
  private msg = '';

  constructor(data: string) {
    try {
      const parsed = /^(\S+)\s+\'(\S+)\'(\s+\'(.+)\')?/.exec(data);
      this.action = parsed[1];
      this.topic = parsed[2];
      this.msg = parsed[4];
    } catch (err) {
      console.error('Unable to parse socket data', err);
    }
  }

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
