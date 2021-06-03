import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewCommunityRegistrationComponent } from './view-community-registration.component';

describe('ViewCommunityRegistrationComponent', () => {
  let component: ViewCommunityRegistrationComponent;
  let fixture: ComponentFixture<ViewCommunityRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCommunityRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommunityRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
