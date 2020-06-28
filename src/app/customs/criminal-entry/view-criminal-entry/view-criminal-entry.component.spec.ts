import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCriminalEntryComponent } from './view-criminal-entry.component';

describe('ViewCriminalEntryComponent', () => {
  let component: ViewCriminalEntryComponent;
  let fixture: ComponentFixture<ViewCriminalEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCriminalEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCriminalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
