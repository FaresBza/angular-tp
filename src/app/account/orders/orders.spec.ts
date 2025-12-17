import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { OrdersPageComponent } from './orders';
import { UserActions } from '../../state/user/user.actions';

describe('OrdersPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('dispatches loadOrders on init', () => {
    const fixture = TestBed.createComponent(OrdersPageComponent);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(UserActions.loadOrders());
  });

  it('openOrder() navigates to /account/orders/:id', () => {
    const fixture = TestBed.createComponent(OrdersPageComponent);
    const component: any = fixture.componentInstance;

    spyOn(component.router, 'navigate');

    component.openOrder('ORD-123');

    expect(component.router.navigate).toHaveBeenCalledWith(['/account/orders', 'ORD-123']);
  });

  it('orderStatusIcon() returns expected icon names', () => {
    const fixture = TestBed.createComponent(OrdersPageComponent);
    const component = fixture.componentInstance;

    expect(component.orderStatusIcon('shipped'));
    expect(component.orderStatusIcon('delivered'));
    expect(component.orderStatusIcon('cancelled'));
    expect(component.orderStatusIcon('unknown'));
  });
});
