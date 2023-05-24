import {Sort} from "../models/sort";
import {SortDirection} from "../models/sort-direction";

export class SortHelper {
  public static convertSortToString(sort: Sort): string {
    return `${sort.field},${sort.direction ?? SortDirection.ASC}`;
  }
}
