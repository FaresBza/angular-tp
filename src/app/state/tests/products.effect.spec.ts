import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { ProductsEffects } from '../products/products.effects';
import { ProductsActions } from '../products/products.action';

describe('Product Effects', () => {
    let actions$: Subject<any>;
    let effects: ProductsEffects;
    let http: HttpTestingController;

    beforeEach(() => {
        actions$ = new Subject<any>();

        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ProductsEffects, provideMockActions(() => actions$)],
        });

        effects = TestBed.inject(ProductsEffects);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('loadProducts → success action', (done) => {
        effects.loadProducts$.subscribe((a) => {
        expect(a.type).toBe(ProductsActions.loadProductsSuccess.type);
        done();
        });

        actions$.next(ProductsActions.loadProducts({ page: 1, pageSize: 10, minRating: 0, ordering: '-created_at' }));

        const req = http.expectOne((r) => r.url.includes('/api/products'));
        req.flush({ count: 0, results: [] });
    });

    it('loadProducts → failure action', (done) => {
        effects.loadProducts$.subscribe((a) => {
        expect(a.type).toBe(ProductsActions.loadProductsFailure.type);
        done();
        });

        actions$.next(ProductsActions.loadProducts({ page: 1, pageSize: 10, minRating: 0, ordering: '-created_at' }));

        const req = http.expectOne((r) => r.url.includes('/api/products'));
        req.flush('err', { status: 500, statusText: 'Server Error' });
    });
});
