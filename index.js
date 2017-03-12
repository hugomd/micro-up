const {send} = require('micro');
const fetch = require('node-fetch');
const assert = require('http-assert');

module.exports = async (req, res) => {
  const url = req.url.substr(1);
  assert(url !== '', 400, 'URL must be defined.');
  let statusCode;
  let message;
  try {
    const response = await fetch(`http://${url}`, {
      timeout: 5000
    });
    statusCode = response.status;
    message = `${url} is up.`;
  } catch (err) {
    const {type, code} = err;
    if (type === 'system' && code === 'ENOTFOUND') {
      statusCode = 200;
      message = `${url} is not up.`;
    } else {
      statusCode = 400;
      message = `Something went wrong.`;
    }
  }
  send(res, statusCode, message);
};
