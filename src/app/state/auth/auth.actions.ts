import { createActionGroup, emptyProps, props } from "@ngrx/store";


export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'login': props<{ username: string, password: string }>(),
        'loginSuccess': props<{ access: string, refresh: string }>(),
        'loginFailure': props<{ error: string }>(),
        'refreshToken': emptyProps(),
        'refreshSuccess': props<{ access: string }>(),
    }
})