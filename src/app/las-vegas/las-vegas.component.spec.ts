import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LasVegasComponent } from './las-vegas.component';

describe('LasVegasComponent', () => {
  let component: LasVegasComponent;
  let fixture: ComponentFixture<LasVegasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LasVegasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LasVegasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
