import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { SideNavComponent } from './side-nav';

describe('SideNavComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavComponent, RouterTestingModule, NoopAnimationsModule],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SideNavComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('renders navigation links', () => {
    const fixture = TestBed.createComponent(SideNavComponent);
    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.css('[routerLink]'));
    expect(links.length).toBeGreaterThan(0);
  });
});
