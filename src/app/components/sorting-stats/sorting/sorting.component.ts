import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SortingService} from '../../../services/sorting.service';
import {Quicksort} from '../../../algorithms/quicksort';
import {AlgoType} from '../sorting-stats.component';
import {DataStateService} from '../../../services/data-state.service';
import {DataBar} from '../../../interfaces/data-bar';


@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.css'],
  providers: [DataStateService]
})
export class SortingComponent implements OnInit {
  dataSet: DataBar[];
  delay = 0.002;

  @Input() newSeed: EventEmitter<number[]>;
  @Input() description: AlgoType;
  @Input() onSortCommand;
  @Input() onStopCommand;
  @Input() onAnimationCommand;
  @Output() isSorting = new BehaviorSubject(false);

  constructor(private ds: DataStateService<number>, public ss: SortingService<number>) {
  }

  ngOnInit(): void {
    this.newSeed.subscribe(seed => this.ds.set(seed));
    this.onSortCommand.subscribe(async () => await this.onSort());
    this.onStopCommand.subscribe(() => this.ss.stop());
    this.onAnimationCommand.subscribe((s) => this.delay = s);
    this.ds.dataSeed.subscribe((data) => this.dataSet = data);
    this.ss.isSorting.subscribe((val) => this.isSorting.next(val));
  }

  async onSort() {
    this.ss.setAlgo(new Quicksort(this.delay));
    this.ss.updates.subscribe((data) => this.dataSet = data);
    await this.ss.sort(this.ds.data);
  }
}
