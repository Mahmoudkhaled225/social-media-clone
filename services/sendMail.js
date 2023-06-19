import nodemailer from "nodemailer";

const sendEmail = async ({ to = "", message = "", subject = "" }) => {
    // connection configuration
    let transporter = nodemailer.createTransport({
        host: "localhost",  // stmp.gmail.com
        port: 587, // 465,
        secure: false, // true  TLS,
        service: "gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS,
        },
    });
    let info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html: message,
    });
    if(info.accepted.length)
        return true;

    return false;
};

export default sendEmail;