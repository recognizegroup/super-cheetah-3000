import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { Sort } from '../../models/sort';
import { SortDirection } from '../../models/sort-direction';

@Component({
  selector: 'app-sortable-field',
  templateUrl: './sortable-field.component.html',
  styleUrls: ['./sortable-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SortableFieldComponent {
  @Input() field: string = '';
  @Input() enabled: boolean = true;
  @Input() current: Sort | null = null;
  @Output() sortChanged$ = new EventEmitter<Sort | null>();

  public toggle(): void {
    if (!this.enabled) {
      return;
    }

    let result: Sort | null;

    if (this.active) {
      switch (this.current!.direction) {
        case SortDirection.ASC:
          result = { field: this.field, direction: SortDirection.DESC};
          break;
        case SortDirection.DESC:
          result = null;
          break;
      }
    } else {
      result = { direction: SortDirection.ASC, field: this.field };
    }

    this.sortChanged$.emit(result);
  }

  get active(): boolean {
    return this.enabled && this.current?.field === this.field;
  }

  get asc() {
    return this.active && this.current?.direction === SortDirection.ASC;
  }

  get desc() {
    return this.active && this.current?.direction === SortDirection.DESC;
  }
}
