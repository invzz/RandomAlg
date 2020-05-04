/// <reference lib="webworker" />

let checks = 0;
let swaps = 0;
let state = false;

const swap = (A: Array<number>, first: number, second: number) => {
  swaps++;
  const aux = A[first];
  A[first] = A[second];
  A[second] = aux;
  // postMessage(A);

};

const partition = (A: Array<number>, p: number, r: number) => {
  const x = A[r];
  let i = p - 1;
  let j = p;
  for (j; j < r; j++) {
    checks ++;
    if (A[j] <= x) {
      i++;
      swap(A, i, j);
    }
  }
  swap(A, i + 1, r);
  return i + 1;
};

const randomizedPartition = (A: Array<number>, p: number, r: number) => {
  const randomIndex = Math.floor(Math.random() * (r - p + 1)) + p;
  swap(A, r, randomIndex);
  return partition(A, p, r);
};


const  randomizedQuickSort = (A: Array<number>, p: number, r: number) => {
  checks ++;
  if (p <= r) {
    const q = randomizedPartition(A, p, r);
    randomizedQuickSort(A, p, q - 1);
    randomizedQuickSort(A, q + 1, r);
  } else {
    state = true;
  }
};


addEventListener('message', ({ data }) => {
  randomizedQuickSort(data, 0, data.length - 1);
  postMessage({dataSet: data, checksCount: checks, swapCount: swaps, isDone: state});
});
