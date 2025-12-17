import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginPageComponent } from './login';
import { AuthActions } from '../state/auth/auth.actions';

describe('LoginPageComponent (simple)', () => {
  let store: MockStore;
  let component: LoginPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent, RouterTestingModule, NoopAnimationsModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');

    const fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatches login action on submit when form is valid', () => {
    component.loginForm.setValue({ 
      firstname: 'Jean',
      lastname: 'Dupont',
      email: 'jean.dupont@gmail.com',
      password: '12345' 
    });
    expect(component.loginForm.valid).toBeTrue();

    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({ 
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'jean.dupont@gmail.com',
        password: '12345' 
      }),
    );
  });

  it('should does not dispatch when form is invalid', () => {
    component.loginForm.setValue({ 
      firstname: '', 
      lastname: '', 
      email: '', 
      password: '' 
    });
    expect(component.loginForm.invalid).toBeTrue();

    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
