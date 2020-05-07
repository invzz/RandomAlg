/// <reference lib="webworker" />


class QuickSort {
  checks = 0;
  swaps = 0;
  state = false;

  swap(A: Array<number>, first: number, second: number)  {
    this.swaps++;
    const aux = A[first];
    A[first] = A[second];
    A[second] = aux;
    // postMessage(A);

  }

  partition(A: Array<number>, p: number, r: number)  {
    const x = A[r];
    let i = p - 1;
    let j = p;
    for (j; j < r; j++) {
      this.checks++;
      if (A[j] <= x) {
        i++;
        this.swap(A, i, j);
      }
    }
    this.swap(A, i + 1, r);
    return i + 1;
  }


  randomizedPartition(A: Array<number>, p: number, r: number)  {
    const randomIndex = Math.floor(Math.random() * (r - p + 1)) + p;
    this.swap(A, r, randomIndex);
    return this.partition(A, p, r);
  }



  randomizedQuickSort(A: Array<number>, p: number, r: number)  {
    this.checks++;
    if (p <= r) {
      const q = this.randomizedPartition(A, p, r);
      this.randomizedQuickSort(A, p, q - 1);
      this.randomizedQuickSort(A, q + 1, r);
    } else {
      this.state = true;
    }
  }

  analyze(data: number[]) {
    this.checks = 0;
    this.swaps = 0;
    this.randomizedQuickSort(data,  0, data.length - 1);
    return {checks: this.checks, swaps: this.swaps};
  }
}
const qs = new QuickSort();


addEventListener('message', ({ data }) => {
  console.log('received', data);
  for (let i = 1; i <= data.n; i++) {
    const res = qs.analyze(data.toBeSorted);
    postMessage({
      dataSet: data.toBeSorted,
      c: {
        name: i,
        value: res.checks
      },
      s: {
        name: i,
        value: res.swaps
    }});
  }
});
