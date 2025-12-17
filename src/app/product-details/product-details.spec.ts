import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';

import { ProductDetailsPageComponent } from './product-details';
import { CartActions } from '../state/cart/cart.actions';
import { UserActions } from '../state/user/user.actions';
import { ReviewsActions } from '../state/reviews/reviews.actions';

describe('ProductDetailsPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            snapshot: { paramMap: convertToParamMap({ id: '1' }) },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('returnToProductsPage() navigates to /shop/products', () => {
    const fixture = TestBed.createComponent(ProductDetailsPageComponent);
    const component = fixture.componentInstance;
    spyOn((component as any).router, 'navigate');

    component.returnToProductsPage();

    expect((component as any).router.navigate).toHaveBeenCalledWith(['shop/products']);
  });

  it('addToCart() dispatches addItem and navigates to /shop/products', () => {
    const fixture = TestBed.createComponent(ProductDetailsPageComponent);
    const component = fixture.componentInstance;
    spyOn((component as any).router, 'navigate');

    component.addToCart({ id: 10, name: 'Test', price: 99, stock: 3 });

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.addItem({
        product: { id: 10, name: 'Test', price: 99, stock: 3 },
      }),
    );

    expect((component as any).router.navigate).toHaveBeenCalledWith(['shop/products']);
  });

  it('toggleWishlist() dispatches toggleWishlistItem', () => {
    const fixture = TestBed.createComponent(ProductDetailsPageComponent);
    const component = fixture.componentInstance;

    component.toggleWishlist(42);

    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.toggleWishlistItem({ productId: '42' }),
    );
  });

  it('submitReview() dispatches createReview when form valid', () => {
    const fixture = TestBed.createComponent(ProductDetailsPageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.reviewForm.setValue({ rating: 5, comment: 'Great product!' });
    expect(component.reviewForm.valid).toBeTrue();

    component.submitReview(99);

    expect(store.dispatch).toHaveBeenCalledWith(
      ReviewsActions.createReview({
        productId: '99',
        rating: 5,
        comment: 'Great product!',
      }),
    );
  });
});
