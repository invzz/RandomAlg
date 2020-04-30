import {Observable} from 'rxjs';
import {BarColors} from '../types/barColors';

export interface Sortable<T> {

  sort(data: T[]): Promise<number>;

  onSwap(): Observable<any>;

  onCheck(): Observable<any>;

  customColors(): Observable<BarColors>;

  onStop(): void;
}
