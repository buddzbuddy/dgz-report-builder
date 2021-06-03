import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateRegistrationComponent } from './create-registration.component';

describe('CreateRegistrationComponent', () => {
  let component: CreateRegistrationComponent;
  let fixture: ComponentFixture<CreateRegistrationComponent>;

  beforeEach(waitForAsync(() => {
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
