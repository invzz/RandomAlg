import {Component, Input, OnInit} from '@angular/core';
import {DataSetService} from '../../services/data-set.service';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.component.html',
  styleUrls: ['./bars.component.css']
})
export class BarsComponent implements OnInit {
  single: any[];
  showXAxis = true;
  showYAxis = true;
  customColors = [
    {
      name: '0',
      value: '#ffffff'
    }
  ];

  colorScheme = {
    domain: ['#0f111a']
  };

  @Input() dataSet: any;
  @Input() height: string;

  constructor(public ds: DataSetService) {  }

  async ngOnInit() {
  }

  onSelect(bar: { name: any, value?: number, label?: any}) {

  }

}
