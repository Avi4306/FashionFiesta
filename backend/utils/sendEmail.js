import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email provider
  auth: {
    user: 'fashionfiesta2056@gmail.com',
    pass: 'tejc kbvp bntm rppn',
  },
});

export const sendOtpEmail = async (email, otpCode) => {
  const mailOptions = {
    from: 'fashionfiesta2056@gmail.com',
    to: email,
    subject: "Your OTP Code",
    text: `Your verification code is ${otpCode}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};