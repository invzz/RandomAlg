/// <reference lib="webworker" />

// returns mode
import {ProcessType} from '../components/byzantine-fault-tolerance/process-type.enum';

function mode(array: number[]) {

  if (array.length === 0) {
    return null;
  }

  const countOne = array.reduce((acc, curr) => {
    if (!acc && curr === 1) {
      return 1;
    } else {
      if (curr === 0 ) {
        return acc;
      }
      if (curr === 1) {
        return acc + 1;
      }
    }
  });

  const countZero = array.length - countOne;

  if (countOne > countZero) {
    return {maj : 1, tally: countOne };
  } else {
    return {maj : 0, tally: countZero };
  }
}


addEventListener('message', ({ data }) => {
  let message;

  let maj: number;
  let tally: number;
  const pid = data.state.pid;

  // unreliable process
  if (data.state.type === ProcessType.unreliable) {
    const coin = Math.round(Math.random());
    message = { bit: coin, pid, msg: {t: 'rnd', v: coin} } ;
  } else {

    // reliable process
    tally = mode(data.prev).tally;
    maj = mode(data.prev).maj;

    const bit = tally >= data.edge ? maj : data.coin;

    const msg = tally >= data.edge ? {t: 'maj', v: maj} : {t: 'coin', v: data.coin};
    message = { bit, pid, maj, tally, coin: data.coin, msg,  };

  }


  postMessage(message);
}
);
