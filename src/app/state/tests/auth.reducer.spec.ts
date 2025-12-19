import { authReducer, initialState } from './../auth/auth.reducer';
import { AuthActions } from './../auth/auth.actions';

describe('Auth Reducer', () => {
    it('loginSuccess stores tokens', () => {
        const state = authReducer(
            initialState,
            AuthActions.loginSuccess(
                { access: 'accessqwe123', refresh: 'refreshrtz456' }
            ),
        );

        expect(state.access).toBe('accessqwe123');
        expect(state.refresh).toBe('refreshrtz456');
    });

    it('loginFailure stores error', () => {
        const state = authReducer(
            initialState,
            AuthActions.loginFailure(
                { error: 'bad credentials' }
            ),
        );

        expect(state.error).toBe('bad credentials');
    });
});
