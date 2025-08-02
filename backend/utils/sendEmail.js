import dotenv from 'dotenv';
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (email, otpCode) => {
  const mailOptions = {
    from: `"Fashion Fiesta" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is ${otpCode}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"Fashion Fiesta" <${process.env.EMAIL_USERNAME}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};