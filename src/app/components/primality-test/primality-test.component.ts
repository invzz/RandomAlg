import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-primality-test',
  templateUrl: './primality-test.component.html',
  styleUrls: ['./primality-test.component.css']
})
export class PrimalityTestComponent implements OnInit, OnDestroy {
  form: FormGroup;
  worker: Worker;
  result: any = {};
  ready = true;
  iResults: any = [];
  testMode: 'single' | 'incremental';
  private runningNumber = 0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      n: [3,  []],
      s: [20, []],
      ls: [3, []],
      l: [10, []],
    });
  }

  ngOnInit(): void {
    this.worker = new Worker('../../workers/mcmiller-rabin-test.worker', { type: 'module'});
    this.worker.onmessage = (m) => {
      this.runningNumber ++;
      if (this.testMode === 'single') {
        this.result = m.data.test;
        console.log(this.result);
        this.ready = true;
      }
      if (this.testMode === 'incremental') {
        if (m.data.test.response !== 'not prime') {
          this.iResults.push({name: m.data.n, value: 1});
        } else {
          this.iResults.push({name: m.data.n, value: 0});
        }

        if (this.form.get('l').value === this.runningNumber) {
          this.iResults = [...this.iResults];
          this.ready = true;
        }
      }
    };
  }

  onTest() {
    this.testMode = 'single';
    this.ready = false;
    this.worker.postMessage({n: this.form.get('n').value, nTests: this.form.get('s').value});
  }
  onIncrementalTest() {
    this.testMode = 'incremental';
    this.ready = false;
    this.iResults = [];
    this.runningNumber = this.form.get('ls').value;
    let messages = this.runningNumber;
    const nruns =  this.form.get('l').value;
    while (messages < nruns) {
      messages++
      this.worker.postMessage({ n: messages, nTests: this.form.get('s').value});
    }
  }
  ngOnDestroy(): void {
    this.worker.terminate();
  }
}
