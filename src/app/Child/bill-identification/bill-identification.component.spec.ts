import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillIdentificationComponent } from './bill-identification.component';

describe('BillIdentificationComponent', () => {
  let component: BillIdentificationComponent;
  let fixture: ComponentFixture<BillIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillIdentificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
