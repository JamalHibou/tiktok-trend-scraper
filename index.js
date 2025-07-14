import express from 'express';
import { chromium } from 'playwright';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.tiktok.com/creator-center/analytics/hashtag', { waitUntil: 'load', timeout: 60000 });

    // Optioneel: inloggen of cookies instellen als nodig

    // Scroll of wacht tot trending data geladen is
    await page.waitForSelector('[data-e2e="hashtag-rank-item"]', { timeout: 15000 });

    const data = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-e2e="hashtag-rank-item"]')).map(el => {
        const name = el.querySelector('.tiktok-x6y88p-H2Text').innerText;
        const views = el.querySelector('.tiktok-d8x57f-H2Text').innerText;
        return { name, views };
      });
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
