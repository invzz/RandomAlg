import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SortingService} from '../../services/sorting.service';
import {UtilsService} from '../../services/utils.service';
import {Quicksort} from '../../algorithms/quicksort';
import {DataBar} from '../../interfaces/data-bar';
import {DataStateService} from '../../services/data-state.service';

@Component({
  selector: 'app-sorting-stats',
  templateUrl: './sorting-stats.component.html',
  styleUrls: ['./sorting-stats.component.css']
})
export class SortingStatsComponent implements OnInit {

  rqs = new AlgoType('Randomized QuickSort');
  seed: EventEmitter<number[]> = new EventEmitter<number[]>();
  sort$: EventEmitter<any> = new EventEmitter<any>();
  stopEmitter: EventEmitter<any> = new EventEmitter<any>();
  delay: EventEmitter<number> = new EventEmitter<number>();

  form: FormGroup;
  test: FormGroup;

  size = 50;
  isSorting = [false];
  dataSet: DataBar[] = [];
  fDataSet: DataBar[] = [];
  progress = 0;
  expect: number;
  numberOfRuns = 10;


  constructor(public ds: DataStateService<number>, public ss: SortingService<number>,
              private fb: FormBuilder, private dataHelper: UtilsService<number>) {
  }

  ngOnInit(): void {

    this.emit();
    this.form = this.fb.group({
      isAnimated: [true, []]
    });

    this.test = this.fb.group({
      number: [10, []]
    });

    this.form.get('isAnimated').valueChanges.subscribe((s) => {
        const delay = s === true ? 0.002 : 0;
        this.delay.emit(delay);
      }
    );

    this.test.get('number').valueChanges.subscribe((s) => {
        this.numberOfRuns = s;
      }
    );
  }

  public async emit() {
    const data = this.dataHelper.orderedArray(this.size);
    await this.dataHelper.shuffle(data);
    await this.ds.set(data);
    await this.seed.emit(data);
    return data;
  }

  sort() {
    this.sort$.emit();
  }

  stop() {
    this.stopEmitter.emit();
  }

  isReady() {
    return this.isSorting.some(val => val === true);
  }

  onSorting(newValue: boolean) {
    this.isSorting[0] = newValue;
  }


  async massiveTests() {
    this.dataSet = [];
    this.fDataSet = [];
    // await this.ds.shuffle().then((shuffled) => data = shuffled.slice());
    const algoFactory = () => new Quicksort(0);
    Promise.resolve().then(() => {
      this.ss.runManyTimes(this.numberOfRuns, this.ds.data, algoFactory)
        .subscribe((results) => {
          console.log(results);
          results.forEach((result, index) =>
            this.dataSet.push({name: index, value: result})
          );
          this.fDataSet = this.frequency();
          this.Expectation();
        });
    });
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

  Expectation() {
    if (this.dataSet.length > 0) {
      const S = this.dataSet.map(x => x.value);
      const R = this.numberOfRuns;
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      Math.round(this.expect = 1 / R * S.reduce(reducer));
    }
  }

}

export class AlgoType {
  constructor(public title: string) {
  }
}

