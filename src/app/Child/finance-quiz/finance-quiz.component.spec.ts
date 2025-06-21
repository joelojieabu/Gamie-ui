import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceQuizComponent } from './finance-quiz.component';

describe('FinanceQuizComponent', () => {
  let component: FinanceQuizComponent;
  let fixture: ComponentFixture<FinanceQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
