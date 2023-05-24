import {Observable} from "rxjs";
import {PageResponse} from "./page-response";

export interface MultiSelectOptions<T> {
  load: (page: number, search?: string) => Observable<PageResponse<T> | T[]>;
  labelKey: string;
  clearable?: boolean;
  searchable?: boolean;
  hideSelected?: boolean;
  compareWith?: (a: T, b: T) => boolean;
}
