const getPasswordResetTemplate = (resetUrl) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            color: #1a202c;
        }
        .header {
            background-color: #4f46e5;
            padding: 24px;
            text-align: center;
            color: white;
        }
        .body {
            padding: 32px;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white !important;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 24px;
        }
        .footer {
            background-color: #f7fafc;
            padding: 16px;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">ATSense Team</h1>
        </div>
        <div class="body">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your account. Click the button below to choose a new one:</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="margin-top: 24px;">This link will expire in <strong>1 hour</strong>. If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <p style="word-break: break-all; font-size: 12px; color: #718096;">${resetUrl}</p>
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            <p>Regards,<br>The ATSense Team</p>
        </div>
        <div class="footer">
            &copy; ${new Date().getFullYear()} ATSense Team. All rights reserved.
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = {
    getPasswordResetTemplate
};
