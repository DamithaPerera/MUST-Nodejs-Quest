const puppeteer = require('puppeteer');
const fs = require('fs');

async function run() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Define credentials and address
    const credentials = {
        id: 'kinsu83',
        password: 'kiminsu83!'
    };
    const address = '경기도 고양시 일산동구 강석로 152 강촌마을아파트 제701동 제2층 제202호 [마두동 796]';

    // Navigate to website
    await page.goto('https://cloud.eais.go.kr/', { waitUntil: 'networkidle2' });

    // Log in
    await page.type('#userId', credentials.id);
    await page.type('#password', credentials.password);
    await page.click('#loginButton'); // Adjust the selector as needed
    await page.waitForNavigation();

    // Navigate to "Issurance of Building Ledger"
    await page.click('selector-for-issurance-of-building-ledger'); // Adjust the selector as needed

    // Input address and generate PDF
    await page.type('selector-for-address-input', address); // Adjust the selector as needed
    await page.click('selector-for-generate-pdf-button'); // Adjust the selector as needed

    // Wait for the PDF generation and download
    const pdfBuffer = await page.waitForSelector('selector-for-pdf-download-link', { visible: true })
        .then(() => page.click('selector-for-pdf-download-link'))
        .then(() => page.waitForResponse(response => response.url()
            .endsWith('.pdf') && response.status() === 200))
        .then(response => response.buffer());

    // Save the PDF
    fs.writeFileSync('result.pdf', pdfBuffer);

    // Close browser
    await browser.close();
}

run().catch(error => console.error(error));
