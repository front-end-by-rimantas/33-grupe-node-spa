import { IsValid } from "../lib/IsValid.js";

const handler = {}

handler.account = async (data, callback) => {
    const allowedHttpMethods = ['get', 'post', 'put', 'delete'];

    if (allowedHttpMethods.includes(data.httpMethod)) {
        return handler._method[data.httpMethod](data, callback);
    }

    return callback(400, {
        msg: `Account API endpoint nepalaiko "${data.httpMethod}" http metodo`,
    });
}

handler._method = {}

handler._method.get = (data, callback) => {
    return callback(200, {
        msg: 'STAI TAU VISA PASKYROS INFO',
    });
}

handler._method.post = (data, callback) => {
    const requiredKeys = ['username', 'email', 'password'];
    const { payload } = data;

    // viso objekto struktura
    if (!payload) {
        return callback(400, {
            msg: 'Nevalidus JSON',
        });
    }

    const keys = Object.keys(payload);
    if (keys.length !== requiredKeys.length) {
        return callback(400, {
            msg: 'Atejes objektas nesutampa su privaloma struktura: email, password, username',
        });
    }
    for (const key of keys) {
        if (!requiredKeys.includes(key)) {
            return callback(400, {
                msg: `Atejes objektas turi raktazodi, kurio nereikia "${key}"`,
            });
        }
    }

    // tipai ir logine reiksme
    const [usernameErr, usernameMsg] = IsValid.username(payload.username);
    if (usernameErr) {
        return callback(400, {
            msg: usernameMsg,
        });
    }

    const [emailErr, emailMsg] = IsValid.email(payload.email);
    if (emailErr) {
        return callback(400, {
            msg: emailMsg,
        });
    }

    const [passwordErr, passwordMsg] = IsValid.password(payload.password);
    if (passwordErr) {
        return callback(400, {
            msg: passwordMsg,
        });
    }

    // patikrinti, ar toks vartotojas jau registruotas (email)
    // slaptazodzio hash'inimas
    // irasome gautus duomenis (aka - uzregistruojame) JSON formatu (failas)

    // graziname pranesima apie sekminga registracija
    return callback(200, {
        msg: 'PASKYRA SUKURTA',
    });
}

handler._method.put = (data, callback) => {
    return callback(200, {
        msg: 'PASKYRA ATNAUJINTA',
    });
}

handler._method.delete = (data, callback) => {
    return callback(200, {
        msg: 'PASKYRA ISTRINTA',
    });
}

export default handler;