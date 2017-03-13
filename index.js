const {send} = require('micro');
const fetch = require('node-fetch');
const assert = require('http-assert');

const protocols = {
  HTTP: 'http://',
  HTTPS: 'https://'
};

module.exports = async (req, res) => {
  let url = req.url.substr(1).split('?')[0];
  let requestScheme;
  if (url === 'favicon.ico') return;
  if (url.startsWith(protocols.HTTP)) {
    url = url.substr(7);
    requestScheme = protocols.HTTP;
  } else if (url.startsWith(protocols.HTTPS)) {
    url = url.substr(8);
    requestScheme = protocols.HTTPS;
  }
  let json = req.url.endsWith('?json');
  assert(url !== '', 400, 'URL must be defined. Usage: https://up.now.sh/google.com');
  let statusCode;
  let message;
  res.setHeader('Content-Type', 'application/json');
  try {
    await fetch(`${requestScheme}${url}`, {
      timeout: 5000
    });
    statusCode = 200;
    if (json) {
      message = {url: url, status: 'Up'};
    } else {
      res.setHeader('Content-Type', 'text/plain');
      message = `${url} is up.`;
    }
  } catch (err) {
    const {type, code} = err;
    if (type === 'system' && code === 'ENOTFOUND') {
      statusCode = 200;
      message = (json) ? ({url: url, status: 'Down'}) : (`${url} is not up.`);
    } else {
      statusCode = 400;
      message = (json) ? ({error: 'Something went wrong.'}) : (`Something went wrong.`);
    }
  }
  send(res, statusCode, message);
};
