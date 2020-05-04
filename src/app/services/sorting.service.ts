import { EventEmitter, Injectable } from '@angular/core';
import { Sortable } from '../algorithms/sorting/sortable.interface';
import { DataBar } from '../interfaces/data-bar';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { animate } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class SortingService<T> {

  algorithm: Sortable<T>;
  customColors: any;

  swaps = 0;
  checks = 0;

  updates = new Subject<DataBar[]>();

  isSorting: EventEmitter<boolean> = new EventEmitter<boolean>();
  yieldedResults = new Subject<{name: number, value: number, isDone: boolean}>();

  constructor() {

  }

  public setAlgo(s: Sortable<T>) {
    this.algorithm = s;
  }

  public sort(toBeSorted: T[]) {
      const worker = new Worker('../workers/quicksort.worker', { type: 'module' });
      worker.onmessage = ({ data }) => {
        this.emit(data.dataSet);
        this.swaps = data.swapCount;
        this.checks = data.checksCount;
      };
      worker.postMessage(toBeSorted);
  }

  public runManyTimes(n, data: T[]) {
    let count = 0;
    let state = false;
    for (let a = 0; a < n; ++a) {
      ++count;
      const worker = new Worker('../workers/quicksort.worker', { type: 'module' });
      worker.onmessage = (m) => {
        --count;
        if (count === 0) {
          state = true;
        }
        this.yieldedResults.next({name: a, value: m.data.checksCount, isDone: state});

      };
      worker.postMessage(data);
    }
  }

  public emit(data) {
    this.updates.next(data.map((val, index) => {
      return { name: index, value: val };
    }));
  }

  public stop() {
    this.algorithm.onStop();
  }

}
