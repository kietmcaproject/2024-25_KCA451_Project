import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./mailTemplate.js";

import { sendEmail } from "./mail.js";


  export const sendVerificationEmail = async (email, verificationToken) => {
    try {
      const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      );
      await sendEmail(email, "Verify Your Email", htmlContent);
      console.log("Verification email sent successfully");
    } catch (error) {
      console.log("Error sending verification email", error);
      throw new Error(`Error sending verification email: ${error}`);
    }
  };
  export const sendWelcomeEmail = async (name, email) => {
    const htmlContent = `<h1>Welcome ${name}!</h1><p>Thanks for joining CodCom!</p>`;
    try {
      await sendEmail(email, "Welcome to CodCom", htmlContent);
      console.log("Welcome email sent successfully");
    } catch (error) {
      console.log("Error sending welcome email", error);
      throw new Error(`Error sending welcome email: ${error}`);
    }
  };
  export const sendResetPasswordEmail =async(email,URL)=>{
    const recipient = [{ email }];
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Reset Password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",URL),
        category: "Password Reset",
      });
      console.log("reset password email successfully", response);
    } catch (error) {
      console.log("error sending reset password email", error);
      throw new Error(`Error sending reset password email :${error}`);
    }

  }
  export const sendSuccessEmail=async(email)=>{
    const recipient = [{ email }];
    try {
      const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Success",
        html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        category: "Registration Success",
      });
      console.log("success email successfully", response);
    } catch (error) {
      console.log("error sending success email", error);
      throw new Error(`Error sending success email :${error}`);
    }
  }