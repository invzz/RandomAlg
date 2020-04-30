import {Injectable} from '@angular/core';
import {UtilsService} from './utils.service';
import {Subject} from 'rxjs';
import {DataBar} from '../interfaces/data-bar';
import {DataHandler} from '../interfaces/data-handler';


@Injectable({
  providedIn: 'root'
})
export class DataStateService<T> implements DataHandler<T> {

  data: T[];
  utils: UtilsService<T>;

  public dataSeed: Subject<DataBar[]> = new Subject<DataBar[]>();

  constructor() {
    this.utils = new UtilsService<T>();
  }

  public async get(): Promise<DataBar[]> {
    return this.data.map((val, index) => {
      return {name: index, value: val};
    });
  }

  public async set(A: T[]) {
    this.data = A;
    await this.emit();
  }

  public async shuffle(array: T[] = this.data) {
    await this.utils.shuffle(array);
    await this.emit();
  }

  public async emit() {
    await this.get().then(
      r => this.dataSeed.next(r)
    );
  }
}
