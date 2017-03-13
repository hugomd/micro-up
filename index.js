const {send} = require('micro');
const fetch = require('node-fetch');
const assert = require('http-assert');

module.exports = async (req, res) => {
  let url = req.url.substr(1).split('?')[0];
  if (url === 'favicon.ico') return;
  if (url.startsWith('http://')) {
    url = url.substr(7);
  } else if (url.startsWith('https://')) {
    url = url.substr(8);
  }
  let json = req.url.endsWith('?json');
  assert(url !== '', 400, 'URL must be defined. Usage: https://up.now.sh/google.com');
  let statusCode;
  let message;
  res.setHeader('Content-Type', 'application/json');
  try {
    await fetch(`http://${url}`, {
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
