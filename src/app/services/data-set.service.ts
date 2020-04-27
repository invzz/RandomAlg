import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Algo} from './algo';
import {newArray} from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class DataSetService {
  SArray: number[];
  public dataObject: Subject<DataBar[]> = new Subject<DataBar[]>();

  checkEvent = new EventEmitter();
  swapEvent = new EventEmitter();
  stopEvent = new EventEmitter();


  customColors: DataBar[];
  isSorting: EventEmitter<boolean> = new EventEmitter<boolean>();

  private delay: number;

  constructor() {  }

  // public setSpeed(ms: number) {
  //   this.algo.slow(ms);
  // }

  public async get(): Promise<DataBar[]> {
    return this.SArray.map((val, index) => {
     return {name: index, value: val + 1};
   });
  }

  public async populate(cardinality: number) {
    this.SArray = [...Array(cardinality).keys()];
    this.emit();
  }

  // shuffles
  public async shuffle(array: number[] = this.SArray) {
    let currentIndex = array.length;
    let currentValue: number;
    let randomIndex: number;
    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // swap random index with current index
      currentValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = currentValue;
    }
    this.emit();
    return array;
  }

  private emit() {
    this.get().then(
      r =>  this.dataObject.next(r)
    );
  }

  async init(cardinality: number = 10) {
    await this.populate(cardinality).then(
      async () => await this.shuffle(this.SArray)
    );
  }

  public async LVQuickSort(delay: number, emit= true) {
    this.isSorting.emit(true);
    const algo = new Algo(this.stopEvent, delay);
    const subscriptions = [
      algo.checkEvent.subscribe(() => { this.checkEvent.emit(); }),
      algo.swapEvent.subscribe(() => { this.swapEvent.emit(); this.emit(); }),
      algo.pointerColor.subscribe((s) => this.customColors = s.customColors()),
    ];
    await algo.LVQuickSort(this.SArray, 0, this.SArray.length - 1).then(() => this.isSorting.emit( false));
    this.customColors = [];
    subscriptions.forEach(s => s.unsubscribe());
    if (emit) {
      this.emit();
    }
  }

  public async set(A: number[]) {
    this.SArray = A;
    this.emit();
  }
}

export interface DataBar {
  name: any;
  value: any;
}

