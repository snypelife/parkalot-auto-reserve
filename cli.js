'use strict'

const [,,username, password] = process.argv
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 980,
    deviceScaleFactor: 1,
  })

  console.log('Going to app.parkalot.io...')

  await page.goto('https://app.parkalot.io/#/login', { waitUntil: 'networkidle2' })

  console.log('Logging in...')
  await page.type('[type="email"]', username)
  await page.type('[type="password"]', password)

  const [logInButton] = (await page.$x('//button[contains(., "log in")]'));
  await logInButton.click()

  await page.waitFor(3000)

  // Rows that don't have weekends
  // and have a button with text "reserve"
  const xpath = '//div[@class="row"][not(contains(., "Saturday")) and not(contains(., "Sunday"))]//button[contains(., "reserve")]'

  const reserveButtons = (await page.$x(xpath));

  console.log('Reserving...')
  while (reserveButtons.length) {
    let reserveButton = reserveButtons.pop()
    await reserveButton.click()
    await page.waitFor(500)
    console.log(`${reserveButtons.length} days left to reserve...`)
  }

  console.log('Reserving complete!')

  await page.waitFor(5000)

  console.log('Logging out...')
  const [logOutButton] = (await page.$x('//a[contains(., "Logout")]'));

  if (logOutButton) {
    await logOutButton.click()
  }

  console.log('Successfully logged out!')
  await page.waitFor(3000)

  await browser.close()
})();
