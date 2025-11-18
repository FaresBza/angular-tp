import { Meta, StoryObj } from '@storybook/angular';
import { LoginFormComponent } from './login-form.component';

const meta: Meta<LoginFormComponent> = {
    title: 'Auth/Login Form',
    component: LoginFormComponent,
    args: {
        submitLogin: (...args: any[]) => { console.log('submitLogin', ...args); },
    },
};

export default meta;
export const Default: StoryObj<LoginFormComponent> = {};
