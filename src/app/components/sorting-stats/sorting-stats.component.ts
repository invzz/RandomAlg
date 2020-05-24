import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SortingService} from '../../services/sorting.service';
import {UtilsService} from '../../services/utils.service';
import {DataBar, Series} from '../../interfaces/data-bar';
import {DataStateService} from '../../services/data-state.service';




@Component({
  selector: 'app-sorting-stats',
  templateUrl: './sorting-stats.component.html',
  styleUrls: ['./sorting-stats.component.scss']
})
export class SortingStatsComponent implements OnInit, OnDestroy {


  seed: EventEmitter<number[]> = new EventEmitter<number[]>();
  delay = 1;

  form: FormGroup;
  test: FormGroup;

  singleRunBars: DataBar[] = [];
  checksPerRun: DataBar[] = [];
  checkExpected: DataBar[] = [];
  swapsPerRun: DataBar[] = [];
  swapExpected: DataBar[] = [];

  checksGraph: Series[] = [];
  chkDist: Series[] = [];
  swpDist: Series[] = [];
  swpDistCl = {
    domain: ['#29bb9c']
  };

  testMode = '';

  size = 50;
  isSorting = false;
  expectedNumberOfChecks: number;
  progress: number;
  numberOfRuns = 10;
  nlogn: DataBar[] = [];
  incrementalData: DataBar[] = [];

  // calculation of c
  private cArray: number[];
  c: number;
  runningNumber = 0;



  constructor(public ds: DataStateService<number>, public ss: SortingService<number>,
              private fb: FormBuilder, private dataHelper: UtilsService<number>) {
  }

  ngOnInit(): void {


    this.emit();

    this.ss.updates.subscribe((data) => {
      console.log(data, this.testMode);
      if (this.testMode === 'Single run') {

        this.singleRunBars = data;
      }
    });

    this.form = this.fb.group({
      isAnimated: [true, []]
    });

    this.test = this.fb.group({
      shuffle: [false, []],
      number: [this.numberOfRuns, []]
    });

    this.form.get('isAnimated').valueChanges.subscribe((s) => {
        this.delay = s ? 1 : 0;
      }
    );

    this.test.get('number').valueChanges.subscribe((s) => {
        this.numberOfRuns = s;
      }
    );

    this.ss.yieldChecks.subscribe((v) => {
      this.runningNumber ++;
      this.progress = Math.floor((this.runningNumber / this.numberOfRuns ) * 100);
      v.c.name = this.runningNumber;
      v.s.name = this.runningNumber;
      this.checksPerRun.push(v.c);
      this.swapsPerRun.push(v.s);
      if (this.runningNumber === this.numberOfRuns ) {
        this.isSorting = false;
        if (this.testMode === 'grow') {
          this.checksGraph = [
            { name: 'n log n', series: this.nlogn },
            { name: 'Checks per run', series: this.checksPerRun },
            { name: 'Swaps per run', series: this.swapsPerRun },
          ];

        } else {
          this.checksGraph = [
            {name: 'Checks per run', series: this.checksPerRun},
            {name: 'checks expected', series: this.checkExpected},
            {name: 'n log n', series: this.nlogn},
            {name: 'Swaps per run', series: this.swapsPerRun},
            {name: 'Swaps expected', series: this.swapExpected},
          ];
          this.chkDist = [
            {name: 'checks', series: this.getDistribution(this.checksPerRun)},
          ];
          this.swpDist = [
            {name: 'swaps', series: this.getDistribution(this.swapsPerRun)}
          ];
        }
      }
      let stats;
      if (this.testMode === 'grow') {
        stats = this.stats(this.checksPerRun, (x) => x * Math.log(x), this.runningNumber);
        this.nlogn.push(stats.fun );
      } else {
        stats = this.stats(this.checksPerRun, (x) => x * Math.log(x));
        this.checkExpected.push(stats.expected);
        this.c = stats.c;
        stats = this.stats(this.swapsPerRun);
        this.swapExpected.push(stats.expected);
      }
    });

    this.ss.isSorting.subscribe((val) => this.isSorting = val);
    this.ds.dataSeed.subscribe((data) => this.singleRunBars = data);
  }

  public async emit() {
    const data = this.dataHelper.orderedArray(this.size);
    await this.dataHelper.shuffle(data);
    await this.ds.set(data);
    await this.seed.emit(data);
    return data;
  }

  async sort() {
    this.testMode = 'Single run';
    await this.ss.run(1, this.ds.data);
  }

  stop() {
    this.ss.stop();
  }

  async massiveTests() {
    this.testMode = 'Multiple runs';
    this.resetData();
    this.ss.run(this.numberOfRuns, this.ds.data);
  }
  async incrementalTest() {
    this.testMode = 'grow';
    this.resetData();
    for (let i = 0; i < this.numberOfRuns; i++ ) {
      this.size = i;
      await this.emit();
      this.ss.run(1, this.ds.data);
    }
  }

  getDistribution(data): any {
    const S: DataBar[] = data.map(x => x.value).reduce((acc: DataBar[], item: number) => {
      const n = item;
      const v = acc[item] ? acc[item].value + 1 : 1;
      acc[item] = {name: n, value: v};
      return acc;
    }, []);
    return S.filter(x => x.value > 0);
  }

  stats(data: DataBar[], comparingFunction?: (x) => number, n= this.size ) {
    if (data.length > 0) {
      const S = data.map(x => x.value);
      const sum = (accumulator, currentValue) => accumulator + currentValue;
      const expectation = 1 / data.length * S.reduce(sum);
      const fun = comparingFunction ? {name: this.runningNumber, value: comparingFunction(n)} : null;
      const expected = {name: data.length, value: expectation};
      const c = comparingFunction ? expectation / fun.value : null;
      return {fun, expected, c};
    }
  }

  async shuffle() {
    this.testMode = 'Single run';
    await this.ds.shuffle();
  }

  async changeInputSize() {
    this.testMode = 'Single run';
    await this.emit();
  }

  private resetData() {
    this.progress = 0;
    this.runningNumber = 0;
    this.checkExpected = [];
    this.swapExpected = [];
    this.isSorting = true;
    this.checksPerRun = [];
    this.swapsPerRun = [];
    this.nlogn = [];
    this.cArray = [];
    this.incrementalData = [];
  }
  ngOnDestroy(): void {

  }
}
