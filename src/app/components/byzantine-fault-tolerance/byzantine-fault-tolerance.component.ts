import {Component, EventEmitter, OnInit} from '@angular/core';
import {Process} from './process';
import {ProcessType} from './process-type.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataBar, Series} from '../../interfaces/data-bar';


@Component({
  selector: 'app-byzantine-fault-tolerance',
  templateUrl: './byzantine-fault-tolerance.component.html',
  styleUrls: ['./byzantine-fault-tolerance.component.css']
})
export class ByzantineFaultToleranceComponent implements OnInit {

  ready = true;
  respondedNumber = 0;
  sentNumber = 0;
  roundNumber = 0;
  form: FormGroup;
  processes: Process[] = [];
  votes: DataBar[];
  private newRound: EventEmitter<any> = new EventEmitter<any>();
  public consensus: number;
  customColors: { name: string; value: string }[];
  results: {c: number, rounds: number}[] = [];
  nRuns = 0;
  resBar: DataBar[] = [];
  resGraph: any = [];
  resultsDist: DataBar[] = [];
  exp: DataBar[] = [];
  var: DataBar[] = [];
  distGraph: Series[];
  private worker: Worker;
  private counters =  {coin: 0, rnd: 0, maj: 0, tally: 0};


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      b: [3, []],
      rProcesses: [11, []],
      uProcesses: [5, []],
      nRuns: [100, []],
    });
  }

  ngOnInit(): void {

    this.worker = this.getWorker();
    this.onInit();

    // when a round is over
    this.newRound.subscribe((value) => {
      console.log(this.counters);
      this.counters = {coin: 0, rnd: 0, maj: 0, tally : 0};
      // counting rounds
      this.roundNumber++;
      this.votes = this.getBars();
      // getting reliable processes votes
      const votes = this.processes.filter(p => p.type === ProcessType.reliable);
      const isConsensus = votes.every((v) => v.vote === 0) || votes.every((v) => v.vote === 1);
      // if all reliable votes have the same value consensus is reached
      if (isConsensus) {
        console.log('consensus reached');
        this.nRuns ++;
        this.consensus = votes[0].vote;
        this.results.push({c: this.consensus, rounds: this.roundNumber});
        const res = this.results.map((x) => x.rounds).sort().reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1 , prev), {});
        const expectation = 1 / this.nRuns * this.results.map((x) => x.rounds).reduce((prev, curr) => prev + curr );
        const variance = 1 / this.nRuns * this.results.map((x) => x.rounds).reduce((prev, curr) => prev + Math.pow(curr - expectation, 2));

        this.var.push({name: this.nRuns , value: variance});
        this.exp.push({name: this.nRuns , value: expectation});

        this.resBar.push({name: this.nRuns, value: this.roundNumber});
        this.resGraph = [{name: 'rounds', series: this.resBar}, ];
        this.distGraph = [{name: 'expectation', series: this.exp}, {name: 'variance', series: this.var},];

        this.resultsDist = [];
        for (const key of Object.keys(res).sort()) {
          this.resultsDist.push({name: key, value: res[key]});
        }
        this.resultsDist = [...this.resultsDist];

        if (this.nRuns < this.form.get('nRuns').value) {
          this.onInit();
          this.MCByzantine();
        } else {
          this.ready = true;
          this.nRuns = 0;
        }
      } else {
        this.nextRound(value.worker);
      }
    });
  }

  randomBit(): number  {
    return Math.round(Math.random());
  }

  getWorker(): Worker {



    if (typeof Worker !== 'undefined') {
      const worker = new Worker('../../workers/mcgeneral-process.worker', {type: 'module'});

      // receiving messages from the processes
      worker.onmessage = (m) =>  {
        const options = this.form.getRawValue();
        const n = options.rProcesses + options.uProcesses;
        // counting responses
        this.respondedNumber++;

        const pid = m.data.pid;
        const vote = m.data.bit;
        this.counters.tally = m.data.tally;
        if (m.data.msg.t === 'coin') {
          this.counters.coin++;

        }
        if (m.data.msg.t === 'rnd') {
          this.counters.rnd++;

        }
        if (m.data.msg.t === 'maj') {
          this.counters.maj++;
        }
        // console.log(m.data.msg, m.data.maj, m.data.tally);
        // memorizing the response
        this.processes[pid].set(vote);

        // if round is over
        if (this.respondedNumber === n) {
          // emit new round
          this.newRound.emit({worker});
        }

        };
      return worker;
    }
  }

  preVote(): Process[] {
    const options = this.form.getRawValue();
    const r = options.rProcesses;
    const t = options.uProcesses;
    const v0 = options.b;

    return [...Array(r + t ).keys()]
      .map((e, index) => {
        let vote: number;
        if ( v0 > 1 || index < (t) ) {
          vote = this.randomBit();
        } else {
          vote = v0;
        }
        return new Process(
          index,
          vote,
          index < (t) ?  ProcessType.unreliable : ProcessType.reliable
        );
      });
  }

  MCByzantine() {

    if (!this.nRuns) {
      this.var = [];
      this.exp = [];
      this.resBar = [];
      this.resultsDist = [];
      this.results = [];
    }

    this.ready = false;
    const options = this.form.getRawValue();
    const n = options.rProcesses + options.uProcesses;
    const v0 = options.b > 1 ? null : options.b;
    if (n > 0) {
      this.roundNumber = 0;

      this.nextRound(this.worker,  v0);
    }
   }

  nextRound(worker: Worker, v0?: number) {

    const isV0 = v0 !== null && v0 !== undefined;

    // reset of sent / received messages
    this.initCounters();

    // shared p = 1/2 coin flip
    const sharedCoin = this.randomBit();

    // sending to each process a message of one bit.
    // reliable processes send get b to other processes
    // unreliable processes will send random 0 or 1 to other processes
    // see send(b) behaviour in process class
    this.processes.forEach(p => {

      // preparing the array to broadcast

      if (isV0) {
        // first round initialized with v0 for reliable processes
        this.processes = this.preVote();

      }
      // other rounds will get b from process state same way send() does
      const previousVote = this.processes.map(x => x.getVote());


      // preparing message to send to the process
      const message = {
        state: p.get(),
        prev: previousVote,
        coin: sharedCoin,
        // edge is 2*t + 1
        edge: this.getEdge()
      };

      // sending the message to the process protocol handler
      // reliable processes will answer with b
      // unreliable processes will answer with 0 or 1 with p = 1/2
      worker.postMessage(message);

      // counting messages sent
      this.sentNumber++;
    });

  }

  onInit() {
    this.processes = this.preVote();
    this.votes = this.getBars();

  }

  initCounters() {
    this.sentNumber = 0;
    this.respondedNumber = 0;
  }


  stop(worker: Worker) {
    worker.terminate();
    this.ready = true ;
  }

  getBars() {
    this.customColors = this.processes
      .filter(x => x.type === ProcessType.reliable)
      .map(p => ({name: p.pid.toString(10), value: '#6e899b'}));
    return this.processes.map(x => ({name: x.pid, value: x.vote}));
  }

  private getEdge() {
    const options = this.form.getRawValue();
    return 2 * options.uProcesses + 1;
  }

  onInitAndRun() {
    this.onInit();
    this.MCByzantine();
  }
  onReset() {
    this.results = [];

  }
}







