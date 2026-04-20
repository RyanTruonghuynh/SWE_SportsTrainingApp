import { Resend } from "resend";
import process from "node:process";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(toEmail, token) {
  const verifyUrl = `http://localhost:5001/auth/verify/${token}`;

  const { data, error } = await resend.emails.send({
    from: "Trainr <onboarding@resend.dev>",
    to: toEmail,
    subject: "Verify your Trainr account",
    html: `
      <h2>Welcome to Trainr!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  console.log("Verification email sent, id:", data.id);
}
