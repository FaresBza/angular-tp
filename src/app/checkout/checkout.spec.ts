import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CheckoutComponent } from './checkout';
import { UserActions } from '../state/user/user.actions';

describe('CheckoutComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('placeOrder() does not dispatch when form invalid', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.addressForm.setValue({
      fullName: '',
      addressLine: '',
      city: '',
      postalCode: '',
      country: '',
      email: '',
    });

    component.placeOrder();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('placeOrder() dispatches createOrderFromCart when form valid', () => {
    const fixture = TestBed.createComponent(CheckoutComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.addressForm.setValue({
      fullName: 'FarBza',
      addressLine: '14 rue du Flon',
      city: 'Lausanne',
      postalCode: '1003',
      country: 'CH',
      email: 'far@test.com',
    });

    component.placeOrder();

    const call = (store.dispatch as jasmine.Spy).calls.mostRecent().args[0];
    expect(call.type).toBe(UserActions.createOrderFromCart.type);
    expect(call.shippingAddress).toEqual({
      line1: '14 rue du Flon',
      city: 'Lausanne',
      zip: '1003',
      country: 'CH',
    });
  });
});
