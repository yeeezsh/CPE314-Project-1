import * as readline from 'readline';

export class Line {
  line: readline.Interface;
  constructor() {
    this.line = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
  }

  onLine(cb: () => void) {
    this.line.on('line', () => {
      return cb();
    });
  }

  initLine() {
    this.line.emit('line');
  }

  question(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.line.question('\nclient > ', line => {
        resolve(line);
        this.line.emit('line');
        return;
      });
    });
  }
}
