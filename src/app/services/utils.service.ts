import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService<T> {

  public async shuffle(array: T[]) {
    let currentIndex = array.length;
    let currentValue: T;
    let randomIndex: number;
    while (currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      currentValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = currentValue;
    }
    return array;
  }

  public orderedArray(cardinality: number) {
    return [...Array(cardinality).keys()];
  }
}
