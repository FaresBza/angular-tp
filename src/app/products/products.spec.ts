import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProductsPageComponent } from './products';
import { ProductsActions } from '../state/products/products.action';
import { UserActions } from '../state/user/user.actions';

describe('ProductsPageComponent', () => {
  let store: MockStore;
  let component: ProductsPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsPageComponent,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    const fixture = TestBed.createComponent(ProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatches loadProducts on search', () => {
    component.filters.setValue({
      page: 1,
      pageSize: 10,
      minRating: 2,
      ordering: '-created_at',
    });

    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      ProductsActions.loadProducts({
        page: 1,
        pageSize: 10,
        minRating: 2,
        ordering: '-created_at',
      }),
    );
  });

  it('should dispatches toggleWishlistItem when toggling wishlist', () => {
    const event = new MouseEvent('click');

    component.toggleWishlist(42, event);

    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.toggleWishlistItem({ productId: '42' }),
    );
  });

  it('should navigates to product details when row is activated via keyboard', () => {
    const router = TestBed.inject(RouterTestingModule as any);
    spyOn((component as any).router, 'navigate');

    component.goToRatingProductPage(5);

    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/shop/details',
      5,
    ]);
  });
});
