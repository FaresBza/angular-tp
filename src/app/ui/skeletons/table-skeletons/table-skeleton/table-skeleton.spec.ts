import { TestBed } from '@angular/core/testing';
import { TableSkeletonComponent } from './table-skeleton';

describe('TableSkeletonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSkeletonComponent],
    }).compileComponents();
  });

  it('returns correct number of skeleton rows', () => {
    const fixture = TestBed.createComponent(TableSkeletonComponent);
    const component = fixture.componentInstance;

    component.rows = 7;

    expect(component.items().length).toBe(7);
  });
});
