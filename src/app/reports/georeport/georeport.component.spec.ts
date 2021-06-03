import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GeoreportComponent } from './georeport.component';

describe('GeoreportComponent', () => {
  let component: GeoreportComponent;
  let fixture: ComponentFixture<GeoreportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
