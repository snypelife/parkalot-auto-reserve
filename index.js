'use strict'

const [username, password] = process.argv.slice(2)
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 768,
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

  const reserveButtons = (await page.$x('//button[contains(., "reserve")]'));

  console.log('Reserving...')
  while (reserveButtons.length) {
    let reserveButton = reserveButtons.pop()
    await reserveButton.click()
    console.log(`${reserveButtons.length} days left to reserve...`)
  }

  console.log('Reserving complete!')

  await page.waitFor(5000)


  console.log('Logging out...')
  const [logOutButton] = (await page.$x('//a[contains(., "Logout")]'));
  await logOutButton.click()

  console.log('Successfully logged out!')
  await page.waitFor(3000)

  await browser.close()
})();
