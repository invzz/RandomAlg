import {Observable, Subject} from 'rxjs';

// export class MCByzantine {
//   // number of processes
//   n: number;
//   // value of bit where consensus occurs
//   v: number;
//   // round
//   round: number;
//   // processes
//   reliableProcesses: Process[];
//   faultyProcesses: Process[];
//   // toss a coin with p=1/2
//   toss = () => (Math.floor(Math.random() * 2));
//
//   createProcesses(relNum, faultyNum) {
//     this.reliableProcesses = [...Array(relNum).keys()].map((e) => {
//         return new ReliableProcess(1);
//     });
//     this.faultyProcesses = [...Array(faultyNum).keys()].map((e) => {
//         return new FaultyProcess();
//     });
//   }
// }
//
// export interface Process {
//   bit: number;
//   MCByzantineGeneral();
// }
//
// export class ReliableProcess implements Process {
//   bit: number;
//   constructor(bit) { this.bit = bit; }
//
//   MCByzantineGeneral() {
//     let loop = true;
//     while (loop) {
//
//     }
//   }
// }
// export class FaultyProcess implements Process {
//   bit: number;
//
//   constructor() {
//     this.bit = (Math.floor(Math.random() * 2));
//   }
//
//   MCByzantineGeneral() {
//     let loop = true;
//     while (loop) {
//       this.publish(bit);
//       const received = this.receive();
//       maj =
//     }
//   }
// }
