import { chromium } from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`HTTP ERROR: ${response.status()} ${response.url()}`);
    }
  });
  
  await page.goto('http://localhost:3003');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
