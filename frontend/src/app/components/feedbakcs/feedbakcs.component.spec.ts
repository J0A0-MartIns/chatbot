import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbakcsComponent } from './feedbakcs.component';

describe('FeedbakcsComponent', () => {
  let component: FeedbakcsComponent;
  let fixture: ComponentFixture<FeedbakcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbakcsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbakcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
