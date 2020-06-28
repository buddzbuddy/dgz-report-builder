import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegistrationComponent } from './create-registration.component';

describe('CreateRegistrationComponent', () => {
  let component: CreateRegistrationComponent;
  let fixture: ComponentFixture<CreateRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
