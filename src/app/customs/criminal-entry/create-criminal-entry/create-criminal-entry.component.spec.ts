import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCriminalEntryComponent } from './create-criminal-entry.component';

describe('CreateCriminalEntryComponent', () => {
  let component: CreateCriminalEntryComponent;
  let fixture: ComponentFixture<CreateCriminalEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCriminalEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCriminalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
