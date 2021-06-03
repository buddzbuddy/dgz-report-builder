import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewIdentityCardComponent } from './view-identity-card.component';

describe('ViewIdentityCardComponent', () => {
  let component: ViewIdentityCardComponent;
  let fixture: ComponentFixture<ViewIdentityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewIdentityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
