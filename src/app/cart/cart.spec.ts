import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CartPageComponent } from './cart';
import { CartActions } from '../state/cart/cart.actions';

describe('CartPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('remove() dispatches removeItem', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.remove(12);

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.removeItem({ productId: 12 }),
    );
  });

  it('changeQuantity() dispatches updateQuantity when next >= 1', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.changeQuantity(10, +1, 2);

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.updateQuantity({ productId: 10, quantity: 3 }),
    );
  });

  it('changeQuantity() does not dispatch when next < 1', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.changeQuantity(10, -1, 1);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('clear() dispatches clearCart', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.clear();

    expect(store.dispatch).toHaveBeenCalledWith(CartActions.clearCart());
  });

  it('applyPromo() dispatches applyCoupon with promoCode', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.promoCode = 'PROMO10';
    component.applyPromo();

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.applyCoupon({ code: 'PROMO10' }),
    );
  });

  it('setDelivery() dispatches setDeliveryMode', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component = fixture.componentInstance;

    component.setDelivery('express');

    expect(store.dispatch).toHaveBeenCalledWith(
      CartActions.setDeliveryMode({ mode: 'express' }),
    );
  });

  it('goToCheckoutPage() navigates to /shop/checkout', () => {
    const fixture = TestBed.createComponent(CartPageComponent);
    const component: any = fixture.componentInstance;

    spyOn(component.router, 'navigate');

    component.goToCheckoutPage();

    expect(component.router.navigate).toHaveBeenCalledWith(['/shop/checkout']);
  });
});
