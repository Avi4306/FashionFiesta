import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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