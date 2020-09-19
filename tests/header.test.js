const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('localhost:3000');
}, 99999);

//cerrar browser despues de cada test
afterEach(async () => {
  await browser.close();
});

test('header text should be "Blogster"', async () => {
  //revisa texto de header en DOM
  const text = await page.$eval('a.brand-logo', (el) => el.innerHTML);
  //se espera que el logo del header sea = Blogster
  expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
  //hace click en login con google clase = ".right a"
  await page.click('.right a');

  //tomar url de google.accounts
  const url = await page.url();

  //regex para solo tomar esa parte del url de auth
  expect(url).toMatch(/accounts\.google\.com/);
});
