import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortableFieldComponent } from './sortable-field.component';

describe('SortableFieldComponent', () => {
  let component: SortableFieldComponent;
  let fixture: ComponentFixture<SortableFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortableFieldComponent]
    });
    fixture = TestBed.createComponent(SortableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
