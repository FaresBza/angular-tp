import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import {
  selectUserLoading,
  selectUserProfile,
  selectUserError,
  selectUserPreferences,
} from '../../state/user/user.selectors';
import { UserActions } from '../../state/user/user.actions';

import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SideNavComponent } from "../../layout/side-nav/side-nav";
import { selectAuthUsername } from '../../state/auth/auth.selectors';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SideNavComponent
],
})
export class ProfilePageComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  loading$ = this.store.select(selectUserLoading);
  profile$ = this.store.select(selectUserProfile);
  error$ = this.store.select(selectUserError);
  preferences$ = this.store.select(selectUserPreferences);
  username$ = this.store.select(selectAuthUsername);

  form = this.fb.nonNullable.group({
    fullName: [''],
    newsletter: [false],
    defaultMinRating: [0],
  });

  ngOnInit(): void {
    this.store.dispatch(UserActions.loadProfile());

    this.profile$.subscribe((profile) => {
      if (profile) {
        this.form.patchValue({
          fullName: profile.fullName ?? '',
          newsletter: profile.preferences.newsletter,
          defaultMinRating: profile.preferences.defaultMinRating ?? 0,
        });
      }
    });
  }

  save() {
    const value = this.form.value;
    this.store.dispatch(
      UserActions.updatePreferences({
        preferences: {
          newsletter: !!value.newsletter,
          defaultMinRating: Number(value.defaultMinRating ?? 0),
        },
      }),
    );
  }
}
