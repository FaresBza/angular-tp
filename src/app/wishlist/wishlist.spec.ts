import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { WishlistPageComponent } from './wishlist';
import { CartActions } from '../state/cart/cart.actions';
import { UserActions } from '../state/user/user.actions';

describe('WishlistPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('addToCart() dispatches CartActions.addItem', () => {
    const fixture = TestBed.createComponent(WishlistPageComponent);
    const component = fixture.componentInstance;

    component.addToCart({ id: 1, name: 'P', price: 10, stock: 5 });

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.addItem({
        product: { id: 1, name: 'P', price: 10, stock: 5 },
      }),
    );
  });

  it('removeFromWishlist() dispatches UserActions.toggleWishlistItem', () => {
    const fixture = TestBed.createComponent(WishlistPageComponent);
    const component = fixture.componentInstance;

    component.removeFromWishlist({ id: 42 });

    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.toggleWishlistItem({ productId: '42' }),
    );
  });

  it('getStarFillPercent() returns correct values', () => {
    const fixture = TestBed.createComponent(WishlistPageComponent);
    const component = fixture.componentInstance;

    expect(component.getStarFillPercent(3, 0)).toBe(100);
    expect(component.getStarFillPercent(3, 2)).toBe(100);
    expect(component.getStarFillPercent(3, 3)).toBe(0);
    expect(component.getStarFillPercent(3.5, 3)).toBe(50);
  });
});
