const {parse} = require('url');
const qs = require('querystring');
const {send} = require('micro');
const fetch = require('node-fetch');

const errors = {
  protocol: 'Invalid protocol. Must be: http:// or https://',
  host: 'Host must be defined. Usage: https://up.now.sh/google.com'
};

const handleReq = (req, res) => {
  let err = [];

  const url = parse(req.url);
  const query = qs.parse(url.query);
  const json = query.json !== undefined;

  const host = parse(url.pathname.substr(1));
  if (host.href === '') err = [res, 400, errors.host];

  const protocol = host.protocol ? host.protocol : 'http:';
  if (!['http:', 'https:'].includes(protocol)) err = [res, 400, errors.protocol];

  const hostname = host.hostname ? host.hostname : parse(`${protocol}//${host.path}`).hostname;

  return {json, protocol, hostname, err};
};

module.exports = async (req, res) => {
  if (req.url === '/favicon.ico') return null;

  const {json, protocol, hostname, err} = await handleReq(req, res);
  if (err.length > 0) return send(...err);

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
  } catch (error) {
    const {type, code} = error;
    if (type === 'system' && code === 'ENOTFOUND') {
      statusCode = 200;
      message = (json) ? ({url: hostname, status: 'Down'}) : (`${hostname} is not up.`);
    } else {
      statusCode = 400;
      message = (json) ? ({error: 'Something went wrong.'}) : ('Something went wrong.');
    }
  }

  send(res, statusCode, message);
};
