import bcrypt from "bcryptjs";

export const hashPassword = (pass,saltRound=+process.env.SALT_ROUNDS) => {
    const hashedPass = bcrypt.hashSync(pass, saltRound);
    return hashedPass;
};

