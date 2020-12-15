import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAnaliticsComponent } from './view-analitics.component';

describe('ViewAnaliticsComponent', () => {
  let component: ViewAnaliticsComponent;
  let fixture: ComponentFixture<ViewAnaliticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAnaliticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAnaliticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
