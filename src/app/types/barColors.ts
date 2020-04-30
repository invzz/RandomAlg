export class BarColors {
  yellow = {name: '0', value: '#fffc00'};
  red = {name: '0', value: '#ff0002'};
  green = {name: '0', value: '#a7ff00'};
  white = {name: '0', value: '#ffffff'};

  constructor(public p?: number, public r?: number, public q?: number, j?: number) {
  }

  setYellow(p: number) {
    this.yellow.name = p.toString(10);
  }

  setRed(q: number) {
    this.red.name = q.toString(10);
  }

  setGreen(r: number) {
    this.green.name = r.toString(10);
  }

  setWhite(j: number) {
    this.white.name = j.toString(10);
  }

  customColors() {
    return [this.yellow, this.red, this.green, this.white];
  }
}
