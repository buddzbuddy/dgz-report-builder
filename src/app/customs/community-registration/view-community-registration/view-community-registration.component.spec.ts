import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCommunityRegistrationComponent } from './view-community-registration.component';

describe('ViewCommunityRegistrationComponent', () => {
  let component: ViewCommunityRegistrationComponent;
  let fixture: ComponentFixture<ViewCommunityRegistrationComponent>;

  beforeEach(async(() => {
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
