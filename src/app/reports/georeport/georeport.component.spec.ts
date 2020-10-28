import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoreportComponent } from './georeport.component';

describe('GeoreportComponent', () => {
  let component: GeoreportComponent;
  let fixture: ComponentFixture<GeoreportComponent>;

  beforeEach(async(() => {
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
