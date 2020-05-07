import {ProcessType} from './process-type.enum';

export class Process {

  constructor(public pid: number, public vote: number, public type: ProcessType ) {  }

  set(bit: number) {
    this.vote = this.send(bit);
  }

  send(b) {
    if (this.type === ProcessType.unreliable) {
      return Math.round(Math.random());
    }
    return b;
  }

  get() {
    return { pid: this.pid, vote: this.vote, type: this.type};
  }

  getVote() {
    return this.send(this.vote);
  }
}
