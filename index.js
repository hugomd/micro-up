const {parse} = require('url');
const qs = require('querystring');
const {send} = require('micro');
const fetch = require('node-fetch');

const errors = {
  protocol: 'Invalid protocol. Must be: http:// or https://',
  host: 'Host must be defined. Usage: https://up.now.sh/google.com'
};

module.exports = async (req, res) => {
  const url = parse(req.url);
  const query = qs.parse(url.query);
  const json = query.json !== undefined;

  const host = parse(url.pathname.substr(1));
  if (host.pathname === 'favicon.ico') return;
  if (host.href === '') return send(res, 400, errors.host);

  const protocol = host.protocol ? host.protocol : 'http:';
  if (!['http:', 'https:'].includes(protocol)) return send(res, 400, errors.protocol);

  const hostname = host.hostname ? host.hostname : parse(`${protocol}//${host.path}`).hostname;

  res.setHeader('Content-Type', 'text/plain');
  if (json) res.setHeader('Content-Type', 'application/json');

  let statusCode;
  let message;

  try {
    await fetch(`${protocol}//${hostname}`, {
      timeout: 5000
    });
    statusCode = 200;
    message = json ? {url: hostname, status: 'Up'} : `${hostname} is up.`;
  } catch (err) {
    const {type, code} = err;
    if (type === 'system' && code === 'ENOTFOUND') {
      statusCode = 200;
      message = (json) ? ({url: hostname, status: 'Down'}) : (`${hostname} is not up.`);
    } else {
      statusCode = 400;
      message = (json) ? ({error: 'Something went wrong.'}) : (`Something went wrong.`);
    }
  }
  send(res, statusCode, message);
};
