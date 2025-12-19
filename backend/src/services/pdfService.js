const puppeteer = require('puppeteer');
const { basicTemplate } = require('./templateService');

exports.generatePDF = async (resume) => {
	const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});

	const page = await browser.newPage();
	await page.setContent(basicTemplate(resume), {
		waitUntil: 'networkidle0'
	});

	const buffer = await page.pdf({
		format: 'A4',
		printBackground: false
	});

	await browser.close();
	return buffer;
};
