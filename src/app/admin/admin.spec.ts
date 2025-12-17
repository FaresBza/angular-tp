import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AdminPageComponent } from './admin';
import { AdminActions } from '../state/admin/admin.actions';

describe('AdminPageComponent', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('dispatches loadDashboard on init', () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      AdminActions.loadDashboard({ limit: 10 }),
    );
  });

  it('stockLabel() returns correct label', () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    const component = fixture.componentInstance;

    expect(component.stockLabel(0, 3)).toBe('Rupture de stock');
    expect(component.stockLabel(2, 3)).toBe('Plus que 2 en stock');
    expect(component.stockLabel(10, 3)).toBe('En stock');
  });

  it('stockClass() returns correct class', () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    const component = fixture.componentInstance;

    expect(component.stockClass(0, 3)).toBe('stock-out');
    expect(component.stockClass(2, 3)).toBe('stock-low');
    expect(component.stockClass(10, 3)).toBe('stock-ok');
  });
});
