import {EventEmitter, Injectable} from '@angular/core';
import {Sortable} from '../algorithms/sortable.interface';
import {DataBar} from '../interfaces/data-bar';
import {forkJoin, Subject} from 'rxjs';

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


  constructor() {
  }

  public setAlgo(s: Sortable<T>) {
    this.algorithm = s;
  }

  public async sort(data: T[]) {
    this.isSorting.emit(true);
    this.swaps = 0;
    this.checks = 0;
    this.algorithm.onSwap().subscribe(() => {
      this.swaps++;
      this.emit(data);
    });
    this.algorithm.onCheck().subscribe(() => this.checks++);
    this.algorithm.customColors().subscribe((colors) => {
      this.customColors = colors.customColors();
    });
    this.algorithm.sort(data).then(() => this.isSorting.emit(false));
  }

  public async emit(data) {
    this.updates.next(data.map((val, index) => {
      return {name: index, value: val};
    }));
  }

  public runManyTimes(n, data: T[], sortableFactory: () => Sortable<T>) {
    const N = [...Array(n).keys()];
    return forkJoin(N.map(() => {
      const ss = new SortingService<T>();
      ss.setAlgo(sortableFactory());
      return ss.algorithm.sort(data.slice());
    }));

  }

  public stop() {
    this.algorithm.onStop();
  }

}
