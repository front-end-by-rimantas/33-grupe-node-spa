class IsValid {
    static username(text) {
        const minLength = 4;
        const maxLength = 12;
        if (typeof text !== 'string') {
            return [true, 'Username turi buti tekstinis'];
        }
        if (text === '') {
            return [true, 'Username negali buti tuscias tekstas'];
        }
        if (text.length < minLength) {
            return [true, `Username turi buti daugiau arba lygu ${minLength} simboliai`];
        }
        if (text.length > maxLength) {
            return [true, `Username turi buti ne daugiau ${maxLength} simboliu`];
        }
        const abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (const letter of text) {
            if (!abc.includes(letter)) {
                return [true, `Username rastas neleistinas simbolis "${letter}"`];
            }
        }
        return [false, 'OK'];
    }

    static email() {
        return [false, 'OK'];
    }

    static password() {
        return [false, 'OK'];
    }
}

export { IsValid }