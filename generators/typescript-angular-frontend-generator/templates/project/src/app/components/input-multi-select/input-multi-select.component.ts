import {Component, forwardRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Subscription} from "rxjs/internal/Subscription";
import {BehaviorSubject, combineLatest, concatMap, map, of, scan, switchMap, takeWhile, tap} from 'rxjs';
import {MultiSelectOptions} from "../../models/multi-select-options";
import {PageResponse} from "../../models/page-response";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-input-multi-select',
  templateUrl: './input-multi-select.component.html',
  styleUrls: ['./input-multi-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMultiSelectComponent),
      multi: true
    }
  ],
})
export class InputMultiSelectComponent<T = any> implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() public placeholder!: string;
  @Input() public readonly = false;
  @Input() public autoSelectSingleItem = false;
  @Input() public inputId?: string;
  @Input() public options!: MultiSelectOptions<T>;
  @Input() public multiple: boolean = false;
  @Input() public static: T[] | undefined = undefined;

  public control = this.fb.control(null as T|null);
  public searchSubject = new BehaviorSubject<string>('');

  private onChangeListener?: (value: any) => any;
  private onTouchedListener?: () => any;

  private loadMoreSubject = new BehaviorSubject<null>(null);
  private refreshSubject = new BehaviorSubject<null>(null);

  public items$ = combineLatest([this.searchSubject, this.refreshSubject]).pipe(
    switchMap(([search]) => {
      return combineLatest([of(search), this.loadMoreSubject]).pipe(
        map(([search]) => [search, 0]), // Initial page number of 0
        scan(([previousSearch, previousPage], [currentSearch, currentPage]) => {
          const newPage = previousPage === -1 ? 0 : +previousPage + 1;

          return [
            currentSearch,
            newPage
          ];
        }),
        concatMap(([search, page]) => this.loadItems(+page, search as string)),
        takeWhile(pageResponse => !this.isPageResponse(pageResponse) || (pageResponse.number === 0 || pageResponse.number < pageResponse.totalPages)),
        tap(it => this.checkIfSingleItemShouldBeSelected(it)),
        map((it) => this.isPageResponse(it) ? it.content : it as any[]),
        scan((acc, items) => [...acc, ...items]),
      );
    }),
  );

  private subscriptions: Subscription[] = [];

  checkIfSingleItemShouldBeSelected(data: T[] | PageResponse<T>) {
    const currentValue = this.control.value;

    if (!this.autoSelectSingleItem || currentValue !== null) {
      return;
    }

    const list = this.isPageResponse(data) ? data.content : data;
    const total = this.isPageResponse(data) ? data.totalElements : list.length;

    if (total !== 1) {
      return;
    }

    this.control.setValue(list[0]);
  }

  loadItems(page: number, search?: string) {
    return this.options.load(page, search);
  }

  isPageResponse(it: PageResponse<any> | any[]): it is PageResponse<any> {
    return (it as PageResponse<any>).content !== undefined;
  }

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.control.valueChanges.subscribe(value => {
        this.onChangeListener && this.onChangeListener(value);
        this.onTouchedListener && this.onTouchedListener();
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  writeValue(value: any) {
    this.control.setValue(value);
  }

  registerOnChange(fn: (value: any) => any) {
    this.onChangeListener = fn;
  }

  registerOnTouched(fn: () => any) {
    this.onTouchedListener = fn;
  }

  loadMore() {
    this.loadMoreSubject.next(null);
  }

  get typeaheadSubject() {
    return (this.options.searchable === false ? null : this.searchSubject) as any;
  }

  get compareFn() {
    return (!this.options.compareWith ? null : this.options.compareWith) as any;
  }

  reload() {
    this.refreshSubject.next(null);
  }
}
