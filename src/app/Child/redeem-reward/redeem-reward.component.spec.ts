import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemRewardComponent } from './redeem-reward.component';

describe('RedeemRewardComponent', () => {
  let component: RedeemRewardComponent;
  let fixture: ComponentFixture<RedeemRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedeemRewardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedeemRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
