const path = require('path');
const express = require('express');
const morgan = require('morgan');

const {
  scrapeYoutubeChannel,
  scrapeTop10Series,
  scrapeTop10Films,
  scrapeTop10News,
} = require('./scrapper');
const { getAllCreators, insertCreator, getAllData } = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // disabled for security on local
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  // res.statusCode = 203;
  // res.status(200) // n'nvoie pas de reponse
  // res.sendStatus(200);
  // res.send({ msg: 'succes' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/creators', async (req, res) => {
  const creators = await getAllCreators();

  res.json(creators);
});

app.post('/creators', async (req, res) => {
  const { name, avatarURL } = await scrapeYoutubeChannel(req.body.channelURL);
  const data = await insertCreator(name, avatarURL, req.body.channelURL);
  res.json(data);
});

app.get('/top-series', async (req, res) => {
  const top_10_series = await scrapeTop10Series(req.query.url, 'series');
  // console.log(req.query.url);

  // const top_10_series = await getAllData('TopSeries');

  res.json(top_10_series);
});

app.get('/top-films', async (req, res) => {
  const top_10_films = await scrapeTop10Films(req.query.url);
  console.log(req.query.url);

  // const top_10_series = await getAllData('TopSeries');

  res.json(top_10_films);
});

app.get('/top-news', async (req, res) => {
  const top_10_news = await scrapeTop10News(req.query.url);

  // const top_10_series = await getAllData('TopSeries');

  res.json(top_10_news);
});

app.use(express.static('public'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
