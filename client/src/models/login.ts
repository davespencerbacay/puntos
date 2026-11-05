export type LoginFormValues = {
    email: string;
    password: string;
};

export type LoginFormTouched = Record<keyof LoginFormValues, boolean>;
export type LoginFormErrors = Record<keyof LoginFormValues, string>;