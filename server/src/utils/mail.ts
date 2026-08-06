import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

export const sendResetEmail = async (
  email: string,
  resetLink: string
): Promise<any> => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "ChatSpark",
        email: "ashishkunar678@gmail.com",
      },
      to: [
        {
          email,
        },
      ],
      subject: "Reset Your Password",
      htmlContent: `
        <h2>Password Reset</h2>
        <p>You requested a password reset.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    console.log("Email sent:", response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};