import { transporter } from "../utils/mail.js";

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};