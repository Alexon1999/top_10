const puppeteer = require('puppeteer');

const { pushData } = require('./db');

async function scrapeYoutubeChannel(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // + select by x-path
    // page.$x return an array
    const [el] = await page.$x(
      '/html/body/ytd-app/div/ytd-page-manager/ytd-browse/div[3]/ytd-c4-tabbed-header-renderer/app-header-layout/div/app-header/div[2]/div[2]/div/div[1]/div/div[1]/ytd-channel-name/div/div/yt-formatted-string'
    );
    const text = await el.getProperty('textContent');
    const name = await text.jsonValue();

    const [el2] = await page.$x('//*[@id="img"]');
    const src = await el2.getProperty('src');
    const avatarURL = await src.jsonValue();

    browser.close();

    return { name, avatarURL };
  } catch (error) {
    console.log(error.message);
  }
}

async function scrapeTop10Series(url) {
  console.log(url);
  try {
    // { headless: false } : open  the real chrome browser
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);

    // await page.screenshot({ path: 'allocine.png' });
    // await browser.waitForTarget(() => false);

    const top_10_series = await page.evaluate(() => {
      const serie_container = document.querySelectorAll(
        'section > div.gd-col-middle > ul > li.mdl > div.card'
      );

      return Array.from(serie_container).map((serie) => {
        return {
          name: `${
            serie.querySelector('figure.thumbnail a.thumbnail-link > div.label')
              .innerText
          } ${serie.querySelector('.meta-title').innerText.trim()}`,
          img: serie.querySelector('figure.thumbnail a.thumbnail-link > img')
            .src,
          // image: serie.children[0].firstElementChild.firstElementChild.src,
          link: serie.querySelector('figure.thumbnail > a').href,
          order: +serie.querySelector(
            'figure.thumbnail a.thumbnail-link > div.label'
          ).innerText,
        };
      });
    });
    // get just the first 10
    top_10_series.length = 10;

    const Arr = top_10_series.sort((a, b) => a.order - b.order);

    // console.log(Arr);

    // Arr.forEach(({ name, img, link }) => {
    //   pushData(name, img, link, 'TopSeries');
    // });

    browser.close();

    return Arr;
  } catch (err) {
    console.log(err.meassage);
  }
}
async function scrapeTop10Films(url) {
  console.log(url);
  try {
    // { headless: false } : open  the real chrome browser
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);

    // await page.screenshot({ path: 'allocine.png' });
    // await browser.waitForTarget(() => false);

    const top_10_films = await page.evaluate(() => {
      const serie_container = document.querySelectorAll(
        'section > div.gd-col-middle > ol > li.mdl > div.card'
      );

      return Array.from(serie_container).map((serie) => {
        return {
          name: `${
            serie.querySelector('figure.thumbnail a.thumbnail-link > div.label')
              .innerText
          } ${serie.querySelector('.meta-title').innerText.trim()}`,
          img: serie
            .querySelector('figure.thumbnail a.thumbnail-link > img')
            .getAttribute('src'),
          // image: serie.children[0].firstElementChild.firstElementChild.src,
          link: serie.querySelector('figure.thumbnail > a').href,
          order: +serie.querySelector(
            'figure.thumbnail a.thumbnail-link > div.label'
          ).innerText,
        };
      });
    });
    // get just the first 10
    top_10_films.length = 10;

    const Arr = top_10_films.sort((a, b) => a.order - b.order);

    // Arr.forEach(({ name, img, link }) => {
    //   pushData(name, img, link, 'TopFilms');
    // });

    browser.close();

    return Arr;
  } catch (err) {
    console.log(err.meassage);
  }
}

async function scrapeTop10News(url) {
  console.log(url);
  try {
    // { headless: false } : open  the real chrome browser
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url);

    // await page.screenshot({ path: 'allocine.png' });
    // await browser.waitForTarget(() => false);

    const top_10_news = await page.evaluate(() => {
      const container = document.querySelector('div.nw-c-most-read__items > ol')
        .children;

      return Array.from(container).map((news) => {
        return {
          name: news.querySelector(
            'span.gs-o-media > div.gs-o-media__body > a > span'
          ).innerText,
          link: news.querySelector('span.gs-o-media > div.gs-o-media__body > a')
            .href,
          order: +news.dataset.entityid[news.dataset.entityid.length - 1],
        };
      });
    });
    // get just the first 10
    top_10_news.length = 10;

    const Arr = top_10_news.sort((a, b) => a.order - b.order);

    // console.log(Arr);

    // Arr.forEach(({ name, img, link }) => {
    //   pushData(name, img, link, 'TopFilms');
    // });

    browser.close();

    return Arr;
  } catch (err) {
    console.log(err.meassage);
  }
}

// scrapeTop10Series('http://www.allocine.fr/series/meilleures/');
// scrapeTop10Films('http://www.allocine.fr/film/meilleurs/');
// scrapeTop10News('https://www.bbc.com/news');

module.exports = {
  scrapeYoutubeChannel,
  scrapeTop10Series,
  scrapeTop10Films,
  scrapeTop10News,
};
