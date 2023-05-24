import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputMultiSelectComponent } from './input-multi-select.component';

describe('InputMultiSelectComponent', () => {
  let component: InputMultiSelectComponent;
  let fixture: ComponentFixture<InputMultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputMultiSelectComponent]
    });
    fixture = TestBed.createComponent(InputMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
