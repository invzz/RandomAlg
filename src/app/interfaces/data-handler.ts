export interface DataHandler<T> {
  get();

  set(A: T[]);

  shuffle(A: T[]);
}
