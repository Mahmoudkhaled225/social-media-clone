import jwt from "jsonwebtoken";

export const createToken = (payload = {}) => {
    (!Object.keys(payload).length) && false;
    const token = jwt.sign(payload, process.env.TOKEN_SIGNATURE,
        {expiresIn: process.env.TOKEN_EXPIRE} );
    return token;
};
