import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFieldTestComponent } from './test-field-test.component';

describe('TestFieldTestComponent', () => {
  let component: TestFieldTestComponent;
  let fixture: ComponentFixture<TestFieldTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFieldTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFieldTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
