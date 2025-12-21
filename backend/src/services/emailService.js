const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('EMAIL_USER or EMAIL_PASS is not set in environment variables!');
    }

    // 1. Create a transporter
    // Using service: 'gmail' is recommended by nodemailer for Gmail accounts
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 2. Define the email options
    const mailOptions = {
        from: `ATSense <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('NODEMAILER ERROR:', err);
        throw err;
    }
};

module.exports = sendEmail;
