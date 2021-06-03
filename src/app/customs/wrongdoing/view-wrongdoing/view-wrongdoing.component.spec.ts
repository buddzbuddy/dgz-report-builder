import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewWrongdoingComponent } from './view-wrongdoing.component';

describe('ViewWrongdoingComponent', () => {
  let component: ViewWrongdoingComponent;
  let fixture: ComponentFixture<ViewWrongdoingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWrongdoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWrongdoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
