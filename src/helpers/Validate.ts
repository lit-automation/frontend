// Email validation method
export const validateEmail: ((email: string) => boolean) = (email: string): boolean => {
    // tslint:disable-next-line:max-line-length ter-max-len
    const re: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
};

// Check if the string only consists of numbers
export const numbersOnly: ((string: string) => boolean) = (string: string): boolean => {
    const re: RegExp = /^[0-9]*$/;

    return re.test(string);
};

// Check if the string has more than n (number) characters. Default = 0
export const hasNumberOfCharacters: (
    (string: string, n?: number) => boolean
) = (
    string: string,
    n: number = 0,
): boolean => {
    return string.length >= n;
};

// Check if the string has a length of n (number).
export const isLength: (
    (string: string, n: number) => boolean
) = (
    string: string,
    n: number,
): boolean => {
    return string.length === n;
};

// Check if the string has a special character
export const containsSpecialCharacter: ((string: string) => boolean) = (string: string): boolean => {
    const re: RegExp = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return re.test(string);
};

// Check if string contains an uppercase character
export const containsUppercaseCharacter: ((string: string) => boolean) = (string: string): boolean => {
    const re: RegExp = /[A-Z]/;

    return re.test(string);
};

// Check if string has a number
export const containsNumber: ((string: string) => boolean) = (string: string): boolean => {
    const re: RegExp = /\d/;

    return re.test(string);
};

// Password validation method
export const validatePassword: ((password: string) => boolean) = (password: string): boolean => {
    return hasNumberOfCharacters(password, window.ENUMS.passwordLength) &&
        containsSpecialCharacter(password) &&
        containsUppercaseCharacter(password) &&
        containsNumber(password);
};
