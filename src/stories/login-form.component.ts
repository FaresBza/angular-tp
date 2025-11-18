import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-login-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule
    ],
    template: `
    <div class="login-page">
        <mat-card class="login-card">
            <h2 class="login-title">My Shop – Login</h2>
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
                <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Username</mat-label>
                    <input matInput formControlName="username" placeholder="Username" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Password</mat-label>
                    <input matInput type="password" formControlName="password" placeholder="Password" />
                </mat-form-field>
                <button mat-raised-button type="submit" class="login-button">
                    Login
                </button>
            </form>
        </mat-card>
    </div>
    `,
    styleUrls: ['./login-form.css'],
})
export class LoginFormComponent {
    private fb = inject(FormBuilder);

    @Output() submitLogin = new EventEmitter<{ username: string; password: string }>();

    form = this.fb.group({
        username: ['demo', Validators.required],
        password: ['demo', Validators.required],
    });

    onSubmit() {
        if (this.form.invalid) return;
        this.submitLogin.emit(this.form.value as any);
    }
}
