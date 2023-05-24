import {Observable, combineLatest, of} from 'rxjs';
import {catchError, concatMap, map, retry, scan, switchMap, takeWhile} from 'rxjs/operators';
import {PageResponse} from '../models/page-response';

export function filteredInfiniteScrollObservable<T, F>(
    filterParams: Observable<F>,
    loadMoreSubject: Observable<any>,
    loadFunction: (page: number, filter: F) => Observable<PageResponse<T>>
): Observable<T[]> {
    return filterParams.pipe(
        switchMap((switchParams: any) => {
            return combineLatest([of(switchParams), loadMoreSubject]).pipe(
                map<[F, void], [F, number]>(([params]) => [params, 0]), // Initial page number of -1
                scan<[F, number]>(([previousParams, previousPage], [currentParams, currentPage]) => {
                    // Calculate page number by sum of previous plus current pagenumber
                    // If previousPage is -1 then start with page 0
                    const newPage = previousPage === -1 ? 0 : previousPage + 1;

                    return [
                        currentParams,
                        newPage
                    ];
                }),
                concatMap<[F, number], Observable<PageResponse<T>>>(([params, page]) => loadFunction(page, params)),
                retry(3), // Retry retrieving at most 3 times
                takeWhile<PageResponse<T>>(pageResponse => {
                    // Take data while last page hasn't been reached yet
                    return pageResponse.number === 0 || pageResponse.number < pageResponse.totalPages;
                }),
                // Only return items, not the other paginated properties
                map<PageResponse<T>, T[]>((it) => it.content),
                scan<T[], T[]>((acc, items) => [...acc, ...items], []),
            );
        }),
        catchError((err) => {
            // Catch error to prevent observable finishing / error-ing
            console.error('Failed retrieving data:', err);
            return of([]);
        }),
    );
}
