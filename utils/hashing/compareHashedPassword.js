import bcrypt from "bcryptjs";

export const CompareHashedPassword = ({ payload = "", referenceData = "" }) => {
    const match = bcrypt.compareSync(payload, referenceData);
    return match;
};