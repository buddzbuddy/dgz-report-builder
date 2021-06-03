import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateIdentityCardComponent } from './create-identity-card.component';

describe('CreateIdentityCardComponent', () => {
  let component: CreateIdentityCardComponent;
  let fixture: ComponentFixture<CreateIdentityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIdentityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
