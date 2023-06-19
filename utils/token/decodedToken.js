import jwt from "jsonwebtoken";
export const decodedToken = (payload = "") => {
    (!payload) && false;
    const decode = jwt.verify(payload, process.env.TOKEN_SIGNATURE);
    return decode;
};