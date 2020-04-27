import {Component, EventEmitter, OnInit} from '@angular/core';
import {DataBar, DataSetService} from './services/data-set.service';
import {newArray} from '@angular/compiler/src/util';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Algo Inspector';
  qs = new AlgoType('QuickSort', 'QuickSort Algorithm');
  rqs = new AlgoType('LVQuickSort', 'Randomized QuickSort Algorithm');
  seed: EventEmitter<number[]> = new EventEmitter<number[]>();
  sort$: EventEmitter<any> = new EventEmitter<any>();
  stopEmitter: EventEmitter<any> = new EventEmitter<any>();
  delay: EventEmitter<number> = new EventEmitter<number>();
  form: FormGroup;
  test: FormGroup;
  size = 50;
  isSorting = [false, false];
  dataSet: DataBar[] = [{name: 1, value: 50}, {name: 2, value: 20}, {name: 3, value: 10}, {name: 4, value: 30}];
  fDataSet: DataBar[] = [];
  progress: string;

  constructor(public ds: DataSetService, private fb: FormBuilder) {
    this.emit();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      isAnimated: [true, []]
    });

    this.test = this.fb.group({
      number: [10, []]
    });

    this.form.get('isAnimated').valueChanges.subscribe((s) => {
        const delay = s === true ? 1 : 0;
        this.delay.emit(delay);
      }
    );
  }

  public async emit() {
    this.ds.populate(this.size).then(async () =>
      this.seed.emit( (await this.ds.shuffle()))
    );
  }

  sort() {
    this.sort$.emit();
  }

  stop() {
    this.stopEmitter.emit();
  }

  isReady() {
    const res = !this.isSorting[0] && !this.isSorting[1];
    return !res;
  }

  onLVSorting(newValue: boolean) {
    this.isSorting[0] = newValue;
  }

  onQSSorting(newValue: boolean) {
    this.isSorting[1] = newValue;

  }

  async massiveTests() {
    const N = this.test.get('number').value;
    this.dataSet = [];
    for (let i = 0; i < N; i++) {
      this.Test( i);
    }

  }

  async Test( i: number) {
    const ds = new DataSetService();
    let swaps = 0;
    let checks = 0;
    const subscriptions = [
      ds.checkEvent.subscribe(() => checks ++),
      ds.swapEvent.subscribe(() => swaps ++),
    ];
    await ds.init(this.size);
    await ds.LVQuickSort(null, false).then(() =>  this.dataSet.push({name: i, value: checks}));
    subscriptions.forEach(s => s.unsubscribe());
    const E = this.Expetation();
    this.fDataSet = this.frequency();
  }

  frequency(): any {
    const S: DataBar[] = this.dataSet.map(x => x.value).reduce((acc: DataBar[], item: number) => {
      const aname = item;
      const avalue = acc[item] ? acc[item].value + 1 : 1;
      acc[item] = {name: aname, value: avalue};
      return acc;
    }, []);
    return S.filter(x => x.value > 0);
  }

  Expetation() {
    const S = this.dataSet.map(x => x.value);
    const R = this.test.get('number').value;
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const sum = 1 / R * S.reduce(reducer);
    return sum;
  }

  async setTitle(i: number, N: number) {
    this.progress = `test number:  ${i + 1} / ${N}` ;
  }
}
export class AlgoType {  constructor(public title: string, public subtitle: string) {} }
