import { Socket } from 'net';

interface Node {
  topic: string; // main key
  s: Socket[];
  ip: string[];
}

type NodeList = Node[];

class SocketList {
  list: NodeList;
  constructor() {
    this.list = [];
  }

  private existTopic(topic: string): boolean {
    const exist = this.list.find(f => f.topic === topic);
    if (exist) return true;
    return false;
  }

  addSubscribe(topic: string, s: Socket, ip: string) {
    const alreadyTopic = this.existTopic(topic);
    //   if()
  }

  //   addSub(topic, s: Socket, ip: string) {}
}
