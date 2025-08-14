import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Replace with your email provider (Gmail, Outlook, etc.)
  auth: {
    user: process.env.MY_EMAIL,  // Email from .env file
    pass: process.env.MY_EMAIL_PASS,  // Password from .env file
  },
});

export const sender = process.env.MY_EMAIL;

export const sendEmail = async (recipient, subject, html) => {
  const mailOptions = {
    from: sender,
    to: recipient,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};
