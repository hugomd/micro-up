const {send} = require('micro');
const fetch = require('node-fetch');
const assert = require('http-assert');

module.exports = async (req, res) => {
  let url = req.url.substr(1).split('?')[0];
  if (url === 'favicon.ico') return;
  if (url.indexOf('http://') !== -1) {
    url = url.substr(7);
  } else if (url.indexOf('https://') !== -1) {
    url = url.substr(8);
  }
  let json = req.url.indexOf('?json') !== -1;
  assert(url !== '', 400, 'URL must be defined. Usage: https://up.now.sh/google.com');
  let statusCode;
  let message;
  try {
    const response = await fetch(`http://${url}`, {
      timeout: 5000
    });
    statusCode = response.status;
    message = (json) ? ({url: url, status: 'Up'}) : (`${url} is up.`);
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
