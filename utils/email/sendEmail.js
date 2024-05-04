const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = async (email, subject, payload, template) => {
  // const fromEmail = process.env.EMAIL_ID || '';
  // const emailPassword = process.env.EMAIL_PASSWORD || '';
  // const emailPort = process.env.EMAIL_PORT || '';
  // const emailHost = process.env.EMAIL_HOST || '';
  const fromEmail = 'user.abr2@gmail.com';
  const emailPassword = 'dokwqwmvzyqkhvpp';
  const emailPort = 465;
  const emailHost = 'smtp.gmail.com';
  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: true,
      auth: {
        user: fromEmail,
        pass: emailPassword,
      },
    });
    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: fromEmail,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(options(), (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info)
        }
      });
    })
  } catch (error) {
    console.log(error.message);
    return error;
  }
};


module.exports = sendEmail;