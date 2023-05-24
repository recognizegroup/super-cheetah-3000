import {BehaviorSubject, Observable} from 'rxjs';
import {map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {PageResponse} from '../models/page-response';

export class Paginator<T> {
    private pageSubject = new BehaviorSubject(0);

    totalElements: number = 0;
    totalPages: number = 0;
    currentPage: number = 0;
    firstItem: number = 0;
    lastItem: number = 0;
    isEmpty: boolean = false;
    loading: boolean = true;

    content$: Observable<T[]> = this.pageSubject.pipe(
        tap(() => this.loading = true),
        switchMap(page => this.loadFunction(page)),
        shareReplay(1),
        tap(response => {
            this.totalPages = response.totalPages;
            this.totalElements = response.totalElements;
            this.firstItem = (response.number * response.size) + Math.min(1, response.content.length);
            this.lastItem = (response.number * response.size) + response.content.length;
            this.currentPage = response.number;
            this.isEmpty = response.empty;
        }),
        map(response => response.content),
        tap(() => {
            this.loading = false;
        }),
        shareReplay(1),
    );

    constructor(private loadFunction: (page: number) => Observable<PageResponse<T>>) {
    }

    next() {
        this.pageSubject.next(this.pageSubject.value + 1);
    }

    previous() {
        this.pageSubject.next(this.pageSubject.value - 1);
    }

    reset() {
        this.pageSubject.next(0);
    }
    setPage(page: number) {
        this.pageSubject.next(page);
    }

    refreshCurrent() {
        this.pageSubject.next(this.pageSubject.value);
    }
}
