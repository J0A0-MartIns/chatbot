import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirUsuarioComponent } from './gerir-usuario.component';

describe('GerirUsuarioComponent', () => {
  let component: GerirUsuarioComponent;
  let fixture: ComponentFixture<GerirUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerirUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerirUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
