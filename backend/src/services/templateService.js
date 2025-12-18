exports.basicTemplate = (resume) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resume.personalInfo.fullName}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #000;
    }
    h1, h2 {
      margin-bottom: 5px;
    }
    hr {
      border: none;
      border-top: 1px solid #000;
      margin: 10px 0;
    }
    ul {
      padding-left: 18px;
    }
  </style>
</head>
<body>

<h1>${resume.personalInfo.fullName}</h1>
<p>
${resume.personalInfo.email} |
${resume.personalInfo.phone} |
${resume.personalInfo.location}
</p>

<hr/>

<h2>Professional Summary</h2>
<p>${resume.summary}</p>

<h2>Skills</h2>
<ul>
${resume.skills.map(skill => `<li>${skill}</li>`).join('')}
</ul>

<h2>Experience</h2>
${resume.experience.map(exp => `
  <strong>${exp.jobTitle} - ${exp.company}</strong><br/>
  <em>${exp.startDate} - ${exp.endDate}</em>
  <ul>
    ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
  </ul>
`).join('')}

<h2>Education</h2>
${resume.education.map(edu => `
  <p>
    <strong>${edu.degree}</strong> - ${edu.institution} (${edu.year})
  </p>
`).join('')}

</body>
</html>
`;
