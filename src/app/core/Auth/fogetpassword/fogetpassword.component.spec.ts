import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogetpasswordComponent } from './fogetpassword.component';

describe('FogetpasswordComponent', () => {
  let component: FogetpasswordComponent;
  let fixture: ComponentFixture<FogetpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FogetpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FogetpasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
