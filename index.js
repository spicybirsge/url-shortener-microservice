require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validator = require("validator")
const links = require("./database/schemas/links")
require('./database/connector')()
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('json spaces', 1)

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async(req, res) => {
  let url = req.body.url;
  if(!url) {
    return res.status(400).json({ error: 'invalid url' })
  }

  let isUrlValid = validator.isURL(url, {require_protocol: true,  protocols: ['http','https']});

  if(!isUrlValid) {
    return res.status(400).json({ error: 'invalid url' })
  }

  let allLinks = await links.find()
  let totalLinks = allLinks.length;
  let id = totalLinks+1
  await links.create({_id: id, original_url: url})

  return res.status(200).json({original_url: url, short_url: id})


})

app.get('/api/shorturl/:id', async(req, res) => {
  let id = req.params.id;
  const shortUrlExist = await links.findOne({_id: id})

  if(!shortUrlExist) {
    return res.sendStatus(404)
  }

  return res.redirect(shortUrlExist.original_url)
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
