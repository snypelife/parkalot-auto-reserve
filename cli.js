#!/usr/bin/env node

'use strict'

const fs = require('fs').promises
const { promisify } = require('util')
const read = promisify(require('read'))
const puppeteer = require('puppeteer')
const homedir = require('os').homedir()

async function configure() {
  console.log('parkalot-auto-reserve hasn\'t been configured yet!')

  const config = {
    username: await read({ prompt: 'Enter your username:', terminal: true }),
    password: await read({ prompt: 'Enter your password:', silent : true, terminal: true })
  }

  await fs.writeFile(`${homedir}/.parkalotrc`, JSON.stringify(config))

  return config
}

;(async () => {
  let config

  try {
    config = JSON.parse(await fs.readFile(`${homedir}/.parkalotrc`))
  } catch (ex) {
    if (ex.code !== 'ENOENT') {
      throw ex
    }
  }

  try {
    if (!config) {
      config = await configure()
    }

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
    await page.type('[type="email"]', config.username)
    await page.type('[type="password"]', config.password)

    const [logInButton] = (await page.$x('//button[contains(., "log in")]'));
    await logInButton.click()

    await page.waitFor(3000)

    const rows = await page.$$('.row')

    let reserveClicked = false
    console.log('Reserving...')
    for (const row of rows) {
      // Find the title by class name.
      const titleElement = await row.$('.r-t')
      if (!titleElement) {
        continue
      }

      // The day of week is the first <span> in the title element.
      const dayOfWeek = await titleElement.$eval('span', node => node.innerText)
      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        continue
      }

      const buttons = await row.$$('button')
      for (const button of buttons) {
        // Find the reserve button.
        const buttonText = await button.evaluate(node => node.innerText)
        if (!buttonText.toLowerCase().includes('reserve')) {
          continue
        }
        
        reserveClicked = true
        await button.click()
        await page.waitFor(500)
      }
    }

    console.log('Reserving complete!')

    // If a reserve button was clicked, give it some time to catch up.
    if (reserveClicked) {
      await page.waitFor(5000)
    }

    console.log('Logging out...')
    const [logOutButton] = (await page.$x('//a[contains(., "Logout")]'));

    if (logOutButton) {
      await logOutButton.click()
    }

    console.log('Successfully logged out!')
    if (reserveClicked) {
      await page.waitFor(3000)
    }

    await browser.close()
  } catch (e) {
    console.error('Eek, something went terribly wrong! Please consider opening an issue at https://github.com/snypelife/parkalot-auto-reserve/issues with the following error:')
    console.error(e)
    process.exit(1)
  }
})();
