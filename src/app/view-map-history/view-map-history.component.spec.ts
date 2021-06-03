import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewMapHistoryComponent } from './view-map-history.component';

describe('ViewMapHistoryComponent', () => {
  let component: ViewMapHistoryComponent;
  let fixture: ComponentFixture<ViewMapHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMapHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMapHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
