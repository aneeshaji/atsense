const htmlDocx = require('html-docx-js');
const { basicTemplate } = require('./templateService');

exports.generateDOCX = (resume) => {
	const html = basicTemplate(resume);
	return htmlDocx.asBlob(html);
};
