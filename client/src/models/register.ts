export type RegisterFormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
};

export type RegisterFormTouched = Record<keyof RegisterFormValues, boolean>;
export type RegisterFormErrors = Record<keyof RegisterFormValues, string>;