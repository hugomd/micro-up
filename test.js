const test = require('ava');
const nock = require('nock');
const micro = require('micro');
const fetch = require('node-fetch');
const listen = require('test-listen');

const api = require('./index');

const service = micro(api);

test('should fail if no URL is defined', async t => {
  const url = await listen(service);
  const response = await fetch(url);
  t.is(response.status, 400);
  t.is(response.statusText, 'Bad Request');
});

test('should succeed with no request scheme defined', async t => {
  nock('http://zeit1.co')
    .get('/')
    .reply(200);

  const url = await listen(service);
  const response = await fetch(`${url}/zeit1.co`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'zeit1.co is up.');
});

test('should succeed with HTTP scheme defined', async t => {
  nock('http://zeit2.co')
    .get('/')
    .reply(200);

  const url = await listen(service);
  const response = await fetch(`${url}/http://zeit2.co`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'zeit2.co is up.');
});

test('should succeed with HTTPS scheme defined', async t => {
  nock('https://zeit3.co')
    .get('/')
    .reply(200);

  const url = await listen(service);
  const response = await fetch(`${url}/https://zeit3.co`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'zeit3.co is up.');
});

test('should succeed if destination is not 200 OK', async t => {
  nock('http://zeit4.co')
    .get('/')
    .reply(400);

  const url = await listen(service);
  const response = await fetch(`${url}/http://zeit4.co`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'zeit4.co is up.');
});

test('should fail if destination is unreachable', async t => {
  const url = await listen(service);
  const response = await fetch(`${url}/http://this.is.not.a.domain`);
  const body = await response.text();
  t.is(response.status, 200);
  t.is(body, 'this.is.not.a.domain is not up.');
});

test('should return json when query string is undefined', async t => {
  nock('http://zeit5.co')
    .get('/')
    .reply(400);

  const url = await listen(service);
  const response = await fetch(`${url}/http://zeit5.co?json`);
  const body = await response.json();
  t.is(response.status, 200);
  t.deepEqual(body, {status: 'Up', url: 'zeit5.co'});
});

test('should return json when query string is not undefined', async t => {
  nock('http://zeit6.co')
    .get('/')
    .reply(400);

  const url = await listen(service);
  const response = await fetch(`${url}/http://zeit6.co?json=something`);
  const body = await response.json();
  t.is(response.status, 200);
  t.deepEqual(body, {status: 'Up', url: 'zeit6.co'});
});

test('should fail if invalid protocol', async t => {
  const url = await listen(service);
  const response = await fetch(`${url}/ftp://this.is.not.a.domain`);
  const body = await response.text();
  t.is(response.status, 400);
  t.is(body, 'Invalid protocol. Must be: http:// or https://');
});
