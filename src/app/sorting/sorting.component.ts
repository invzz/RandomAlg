import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataSetService, DataBar} from '../services/data-set.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlgoType} from '../app.component';
import {BehaviorSubject} from 'rxjs';



@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css'],
  providers: [DataSetService]
})
export class SortingComponent implements OnInit {
  dataSet: DataBar[];
  swaps = 0;
  checks = 0;
  delay = 1;


  @Input() description: AlgoType;
  @Input() seed;
  @Input() sort ;
  @Input() stopEvent;
  @Input() delayEvent;

  @Output() isSorting = new BehaviorSubject(false);

  constructor(private ds: DataSetService) {
  }

  ngOnInit(): void {

    this.seed.subscribe(async (seed) => { await this.setData(seed); });
    this.sort.subscribe(async () =>  await this.onSort());
    this.delayEvent.subscribe((s) => this.delay = s );
    this.ds.dataObject.subscribe((data) => this.dataSet = data);
    this.ds.isSorting.subscribe((val) => this.isSorting.next(val));
  }

  async onSort() {
    this.swaps = 0;
    this.checks = 0;

    const subscriptions = [
      this.ds.checkEvent.subscribe(() => this.checks ++),
      this.ds.swapEvent.subscribe(() => this.swaps ++),
      this.stopEvent.subscribe(() => this.ds.stopEvent.emit())
    ];
    await this.ds.LVQuickSort(this.delay);
    subscriptions.forEach(s => s.unsubscribe());
  }

  async setData(A: number[]) {
    this.swaps = 0;
    this.checks = 0;
    await this.ds.set(Array.from(A));
  }
}
