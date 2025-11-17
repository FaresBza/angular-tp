// src/app/pages/login/login.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';

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
import { MatChipsModule } from '@angular/material/chips';
import { filter, take } from 'rxjs';

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
    MatChipsModule,
  ],
})
export class LoginPageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  loginForm = this.fb.group({
    username: ['demo', Validators.required],
    password: ['demo', Validators.required],
  });

  ngOnInit(): void {
    this.isLoggedIn$
      .pipe(
        filter((loggedIn) => loggedIn),
        take(1)
      )
      .subscribe(() => {
        this.router.navigate(['/shop/products']);
      });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    this.store.dispatch(
      AuthActions.login({
        username: username ?? '',
        password: password ?? '',
      })
    );
  }
}
