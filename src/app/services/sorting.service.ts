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
  yieldChecks = new Subject<any>();
  private qsWorker: Worker;


  constructor() {
    this.getNewQsWorker();
  }

  public getNewQsWorker() {
    this.qsWorker = new Worker('../workers/quicksort.worker', {type: 'module'});
    this.qsWorker.onmessage = ({ data }) => {
      if (data.type > 0) {
        this.yieldChecks.next(data);
        this.updates.next(data.dataSet.map((val, index) => ({
          name: index, value: val
        })));
        this.swaps = data.s.value;
        this.checks = data.c.value;
      } else {
        this.updates.next(data.dataSet.map((val, index) => ({
          name: index, value: val
        })));
      }
    };
  }

  public run(numberOfTimes: number, toBeSorted: T[]) {
    this.qsWorker.postMessage({toBeSorted, n: numberOfTimes});
  }

  public stop() {
    this.qsWorker.terminate();

    this.getNewQsWorker();
  }

}
