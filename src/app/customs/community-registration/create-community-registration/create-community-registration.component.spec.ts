import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateCommunityRegistrationComponent } from './create-community-registration.component';

describe('CreateCommunityRegistrationComponent', () => {
  let component: CreateCommunityRegistrationComponent;
  let fixture: ComponentFixture<CreateCommunityRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCommunityRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
