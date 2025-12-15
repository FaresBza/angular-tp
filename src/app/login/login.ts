import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

import { AuthActions } from '../state/auth/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectIsLoggedIn,
} from '../state/auth/auth.selectors';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginPageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.invalid) return;

    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';

    this.store.dispatch(AuthActions.login({ username, password }));

    this.isLoggedIn$
      .pipe(
        filter((loggedIn) => loggedIn),
        take(1),
      )
      .subscribe(() => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        if (username == 'admin') {
          this.router.navigate(['/dashboard/admin']);
        } else {
          this.router.navigate(['/shop/products']);
        }
      });
  }
}
