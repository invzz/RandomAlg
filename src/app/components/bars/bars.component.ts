import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {

  @Input() showX = true;
  @Input() showY = true;
  @Input() showXAxisLabel = true;
  @Input() showYAxisLabel = true;
  @Input() customColors = [];

  colorScheme = {
    domain: ['#0f111a']
  };

  @Input() dataSet: any;
  @Input() height: string;

  constructor() {
  }

  async ngOnInit() {
  }

}
