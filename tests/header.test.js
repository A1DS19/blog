const puppeteer = require('puppeteer');
test('should load new browser page', async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('localhost:3000');

  //revisa texto de header en DOM
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);

  //asercion que el texto sea = Blogster
  expect(text).toEqual('Blogster');
}, 99999);
