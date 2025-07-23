// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true })); // for form submissions
app.use(express.json()); // for JSON submissions


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// In-memory store for simplicity
const urlDatabase = {};
let idCounter = 1;

// ✅ POST: /api/shorturl
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Basic validation for http(s) URLs
  const urlRegex = /^https?:\/\/.+/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = idCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

// ✅ GET: /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.status(404).json({ error: 'No short URL found for given input' });
  }
});

//who am i endpoint
app.get('/api/whoami', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});

// Timestamp endpoint
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;

  let date;
  if (!dateParam) {
    date = new Date();
  } else if (!isNaN(dateParam)) {
    // If it's a Unix timestamp in milliseconds or seconds
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (date.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});