const nodemailer = require("nodemailer");
const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_NOREPLAY,
} = require("../../configs/server.config");
const path = require("path");
const ejs = require("ejs");

const sendMail = async (options) => {
  try {
    let message;
    let transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false, //true for live server false for local machine
      },
    });

    const { email, subject, template, data } = options;

    // Get the email template file
    const templatePath = path.join(__dirname, "../../mails", template);

    // Render the email template with EJS
    const html = await ejs.renderFile(templatePath, data);

    message = await transport.sendMail({
      from: MAIL_NOREPLAY, // Sender address
      to: email, // List of recipients
      subject: subject, // Subject line
      html: html,
    });
  } catch (err) {
    return false;
  }
};

module.exports = {
  sendMail,
};
