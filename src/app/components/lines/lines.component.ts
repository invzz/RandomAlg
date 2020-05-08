import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.css']
})
export class LinesComponent implements OnInit {

  constructor() { }
  @Input() C = 0;
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
  @Input() chartClass: 'small' | 'medium' | 'large' = 'large';

  ngOnInit(): void {
  }

}
