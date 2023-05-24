import {Component, Input} from '@angular/core';
import {Paginator} from '../../util/paginator';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html'
})
export class PaginationComponent<T> {
  @Input() paginator!: Paginator<T>;
}
