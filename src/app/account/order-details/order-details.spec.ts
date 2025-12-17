import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

import { OrderDetailsPageComponent } from './order-details';
import { UserActions } from '../../state/user/user.actions';

describe('OrderDetailsPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'ORD-123' }) },
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('dispatches loadOrderDetails on init when id exists', () => {
    const fixture = TestBed.createComponent(OrderDetailsPageComponent);
    fixture.detectChanges(); 

    expect(store.dispatch).toHaveBeenCalledWith(
      UserActions.loadOrderDetails({ id: 'ORD-123' }),
    );
  });

  it('does not dispatch when id is missing', async () => {
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [OrderDetailsPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
      ],
    }).compileComponents();

    const store2 = TestBed.inject(MockStore);
    spyOn(store2, 'dispatch');

    const fixture = TestBed.createComponent(OrderDetailsPageComponent);
    fixture.detectChanges();

    expect(store2.dispatch).not.toHaveBeenCalled();
  });
});
