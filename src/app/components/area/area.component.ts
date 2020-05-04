import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  constructor() { }
  @Input() title = 'Graph';
  @Input() height = 0;
  @Input() showX = true;
  @Input() showY = true;
  @Input() showXAxisLabel = true;
  @Input() showYAxisLabel = true;
  @Input() customColors = [];
  @Input() dataSet: any =  [{name: 'a', series: [{ name: 1, value: 1}]}];
  @Input() xLabel: any = 'X';
  @Input() yLabel: any = 'Y';
  @Input() animations = true;
  @Input() checks = null;
  @Input() swaps = null;

  ngOnInit(): void {
  }

}
