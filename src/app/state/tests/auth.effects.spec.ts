import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { AuthEffects } from '../auth/auth.effects';
import { AuthActions } from '../auth/auth.actions';

describe('Auth Effect', () => {
    let actions: Subject<any>;
    let effects: AuthEffects;
    let http: HttpTestingController;

    beforeEach(() => {
        actions = new Subject<any>();

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthEffects, provideMockActions(() => actions)],
        });

        effects = TestBed.inject(AuthEffects);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('should create a login success action', (done) => {
        effects.login$.subscribe((a) => {
            expect(a.type).toBe(AuthActions.loginSuccess.type);
            done();
        });

        actions.next(AuthActions.login(
            {
                firstname: 'Jean',
                lastname: 'Dupont',
                email: 'jean.dupont@gmail.com',
                password: '12345' 
            }
        ));

        const req = http.expectOne((r) => r.url.includes('/api/auth/token'));
        req.flush({ access: 'access123', refresh: 'refresh123' });
    });

    it('should create a login failure action', (done) => {
        effects.login$.subscribe((effect) => {
            expect(effect.type).toBe(AuthActions.loginFailure.type);
            done();
        });

        actions.next(AuthActions.login(
            {
                firstname: 'Jean',
                lastname: 'Dupont',
                email: 'jean.dupont@gmail.com',
                password: '12345' 
            }
        ));

        const req = http.expectOne((r) => r.url.includes('/api/auth/token'));
        req.flush(
            { detail: 'Invalid' }, 
            { status: 401, statusText: 'Unauthorized' }
        );
    });
});
