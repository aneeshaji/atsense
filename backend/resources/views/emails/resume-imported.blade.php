<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ATSense</h1>
        </div>
        <p>Hi {{ $name }},</p>
        <p>Your resume has been successfully imported into <strong>ATSense Career Studio</strong>!</p>
        <p>We've already run a preliminary analysis. You are now one step away from having a perfectly tailored resume that will beat the ATS and get you that interview.</p>
        <p style="text-align: center; margin: 30px 0;">
            <a href="https://atsense.online/builder" class="btn">Finish Optimizing Your Resume</a>
        </p>
        <p>Features ready for you:</p>
        <ul>
            <li><strong>AI Deep Tailoring</strong> - perfectly match any job description.</li>
            <li><strong>ATS Scorecard</strong> - see exactly where you stand.</li>
            <li><strong>Premium Templates</strong> - professional, recruiter-approved designs.</li>
        </ul>
        <p>Best regards,<br>The ATSense Team</p>
        <div class="footer">
            <p>&copy; {{ date('Y') }} ATSense. All rights reserved.</p>
            <p>You received this email because you uploaded your resume to atsense.online.</p>
        </div>
    </div>
</body>
</html>
