exports.basicTemplate = (resume) => {
  const { personalInfo, experience, education, skills, summary } = resume;

  // Helper to safely get social links
  const linkedin = personalInfo?.linkedin || '';
  const github = personalInfo?.github || '';
  const location = personalInfo?.location || '';
  const email = personalInfo?.email || '';
  const phone = personalInfo?.phone || '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${personalInfo?.fullName || 'Resume'}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @page { margin: 0.5in 0.75in; }
    body {
      font-family: 'Bitstream Charter', 'Georgia', 'Times New Roman', serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 20px;
    }

    a { text-decoration: none; color: #000; }

    /* Colors from LaTeX */
    .google-blue { color: rgb(66, 133, 244); }
    .google-red { color: rgb(219, 68, 55); }
    .google-green { color: rgb(15, 157, 88); }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .name {
      font-size: 22pt;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .contact-info {
      font-size: 10pt;
      color: #333;
    }
    .contact-item {
      display: inline-block;
      margin: 0 8px;
    }
    .contact-item i {
      margin-right: 4px;
      font-size: 0.9em;
    }

    /* Sections */
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase; /* approximates \\scshape */
      letter-spacing: 0.5px;
      border-bottom: 1px solid #000;
      margin-top: 15px;
      margin-bottom: 8px;
      padding-bottom: 2px;
    }

    .content {
      text-align: justify;
      margin-bottom: 10px;
    }

    /* Experience Item: Matches LaTeX Format
       Line 1: Role (Bold) ... Date (Blue)
       Line 2: Company (Bold), Location
    */
    .exp-item {
      margin-bottom: 12px;
    }
    .exp-row-1 {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .exp-role {
      font-size: 10pt;
    }
    .exp-date {
      color: rgb(66, 133, 244); /* Google Blue */
      font-weight: normal;
    }
    .exp-row-2 {
      font-weight: bold;
      font-size: 10pt;
      margin-bottom: 4px;
    }

    /* Education Item */
    .edu-item {
      margin-bottom: 8px;
    }
    .edu-row {
      display: flex;
      justify-content: space-between;
    }
    .edu-degree { font-weight: bold; }
    .edu-year { color: rgb(219, 68, 55); /* Google Red */ }
    .edu-school { font-weight: bold; }

    /* Lists */
    ul {
      margin: 2px 0 10px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 2px;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="name">${personalInfo?.fullName || 'Your Name'}</div>
    <div class="contact-info">
      ${email ? `<span class="contact-item"><i class="fas fa-envelope"></i> <a href="mailto:${email}">${email}</a></span>` : ''}
      ${phone ? `<span class="contact-item"><i class="fas fa-phone"></i> ${phone}</span>` : ''}
      ${location ? `<span class="contact-item"><i class="fas fa-map-marker-alt"></i> ${location}</span>` : ''}
      ${linkedin ? `<br/><span class="contact-item"><i class="fab fa-linkedin"></i> ${linkedin}</span>` : ''}
      ${github ? `<span class="contact-item"><i class="fab fa-github"></i> ${github}</span>` : ''}
    </div>
  </div>

  <!-- SUMMARY -->
  ${summary ? `
  <div class="section-title">Professional Summary</div>
  <div class="content">
    ${summary}
  </div>
  ` : ''}

  <!-- SKILLS -->
  ${skills && skills.length > 0 ? `
  <div class="section-title">Technical Skills</div>
  <div class="content">
    <ul>
      <li><strong>Skills:</strong> ${skills.join(', ')}</li>
    </ul>
  </div>
  ` : ''}

  <!-- EXPERIENCE -->
  ${experience && experience.length > 0 ? `
  <div class="section-title">Professional Experience</div>
  <div>
    ${experience.map(exp => `
      <div class="exp-item">
        <div class="exp-row-1">
          <span class="exp-role">${exp.jobTitle}</span>
          <span class="exp-date">${exp.startDate} – ${exp.endDate}</span>
        </div>
        <div class="exp-row-2">
          ${exp.company}, ${location || 'Location'} 
          <!-- Note: The LaTeX had location on 2nd line. We don't have per-job location in DB yet, referencing user location or blank -->
        </div>
        <ul>
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- EDUCATION -->
  ${education && education.length > 0 ? `
  <div class="section-title">Education</div>
  <div>
    ${education.map(edu => `
      <div class="edu-item">
        <div class="edu-row">
            <span class="edu-degree">${edu.degree}</span>
            <span class="edu-year">${edu.year}</span>
        </div>
        <div class="edu-school">${edu.institution}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

</body>
</html>
`;
};
