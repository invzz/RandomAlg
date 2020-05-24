/// <reference lib="webworker" />
/**
 * Fast modular exponentiation for a ^ b mod n
 */
const FME = (a, b, n) => {
  a = a % n;
  let result = 1;
  let x = a;

  while (b > 0) {
    const leastSignificantBit = b % 2;
    b = Math.floor(b / 2);

    if (leastSignificantBit === 1) {
      result = result * x;
      result = result % n;
    }

    x = x * x;
    x = x % n;
  }
  return result;
};
const Witness = (a, n) => {
  let s = 0;
  let q = n - 1;

  // factoring
  while (q % 2 === 0) {
    s++;
    q = q / 2;
  }

  let x0 = FME(a, q, n);

  for (let  i = 1; i <= s ; i++) {
    const xi = (x0 * x0) % n;
    if (xi === 1 && x0 !== 1 && x0 !== n - 1) {
      return true;
    }
    x0 = xi;
  }
  return x0 !== 1;
};
const MCRabinMillerTest = (n, nTests) => {
  const tried = [];
  for (let i = 1 ; i <= nTests; i++) {
    const a = Math.floor(Math.random() * (n - 1 - 1)) + 1;
    if (Witness(a, n)) {
      tried.push({w: 'found witness : ', a, i});
      return {response: 'not prime', tried};
    }
  }
  return {response: 'Maybe Prime with very high probability', tried};
};

addEventListener('message', ({ data }) => {
  console.log(data);
  const message =  { n: data.n, test: MCRabinMillerTest(data.n, data.nTests)};
  postMessage(message);
});
