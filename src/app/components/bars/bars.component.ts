import {Component, Input } from '@angular/core';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.scss']
})
export class BarsComponent  {
  colorScheme = { domain: ['#0f111a'] };
  @Input() title = 'Graph';
  @Input() height = 0;
  @Input() showX = true;
  @Input() showY = true;
  @Input() showXAxisLabel = true;
  @Input() showYAxisLabel = true;
  @Input() customColors = [];
  @Input() dataSet: any;
  @Input() xLabel: any = 'X';
  @Input() yLabel: any = 'Y';
  @Input() animations = true;
  @Input() checks = null;
  @Input() swaps = null;



  constructor() {  }

}
