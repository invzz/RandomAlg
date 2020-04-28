import {EventEmitter} from '@angular/core';

export class Quicksort {

  swapEvent = new EventEmitter();
  checkEvent = new EventEmitter();
  pointerColor: EventEmitter<PointersColors> = new EventEmitter<PointersColors>();
  private coloredBars: PointersColors = new PointersColors(0, 0, 0, 0);
  stop: boolean;

  constructor(public stopEvent: EventEmitter<any>, private delay?: number ) {
    this.stop = false;
    this.stopEvent.subscribe(() => this.stopToggle());
  }

  public stopToggle() {
    this.stop = !this.stop;
  }

  private async wait(ms: number = this.delay) {
    if (this.stop) {return; }
    if (ms !== null ) {
      return new Promise(resolve => {
      setTimeout(resolve, ms);
       });
    }
  }

  public async swap(A: Array<number>, first: number, second: number) {
    if (this.stop) {return; }
    const aux = A[first];
    A[first] = A[second];
    A[second] = aux;
    this.swapEvent.emit();
    if (this.delay) {
      await this.wait(1);
    }
  }

  public async partition(A: Array<number>, p: number, r: number) {
    if (this.stop) {return; }
    const x = A[r];
    let i = p - 1;
    let j = p;
    this.coloredBars.setj(j);
    this.pointerColor.emit(this.coloredBars);
    for (j; j < r; j++) {
      this.checkEvent.emit();
      if (A[j] <= x) {
        this.coloredBars.setj(j);
        this.pointerColor.emit(this.coloredBars);
        this.checkEvent.emit();
        i++;
        await this.swap(A, i, j);
      }
    }
    await this.swap(A, i + 1, r);
    return i + 1;
  }

  private async randomizedPartition(A: Array<number>, p: number, r: number) {
    if (this.stop) {return; }
    const randomIndex = Math.floor(Math.random() * (r - p + 1) ) + p ;
    await this.swap(A, r, randomIndex);
    return await this.partition(A, p, r);
  }

  public async LVQuickSort(A: Array<number>, p: number, r: number) {
    if (this.stop) {return; }
    this.coloredBars.setp(p);
    this.coloredBars.setr(r);
    if (p < r) {
      this.checkEvent.emit();
      const q = await this.randomizedPartition(A, p, r);
      this.coloredBars.setq(q);
      this.pointerColor.emit(this.coloredBars);

      // TODO: indagare  se possibile parallelizzare
      await this.LVQuickSort(A, p, q - 1);
      await this.LVQuickSort(A, q + 1, r);
    }
  }
}
class PointersColors {
  pColor = {name : '3', value : '#fffc00' };
  qColor = {name : '4', value : '#ff0002' };
  rColor = {name : '5', value : '#a7ff00' };
  jColor = {name : '5', value : '#ffffff' };

  constructor(public p: number, public r: number, public q: number, j: number = null) {
    this.setp(p);
    this.setq(q);
    this.setr(r);
    this.setj(j);
  }

  setp(p: number) {
    this.pColor.name = p.toString(10);
  }
  setq(q: number) {
    this.qColor.name = q.toString(10);
  }
  setr(r: number) {
    this.rColor.name = r.toString(10);
  }
  setj(j: number) {
    this.jColor.name = j.toString(10);
  }
  customColors() {
    return [this.pColor, this.qColor, this.rColor, this.jColor];
  }


}
