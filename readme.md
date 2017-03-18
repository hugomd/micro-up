# Micro 🆙 [![Build status](https://img.shields.io/travis/hugomd/micro-up.svg?style=flat-square)](https://travis-ci.org/hugomd/micro-up)
A microservice that checks whether a website is up or not.

## Usage
By default, availability information is sent using plaintext, e.g.

```
GET https://up.now.sh/google.com
HTTP/1.1 200 OK

google.com is up.
```

### Using JSON

You can override the default (plaintext) by appending `?json` to the end of the URL, eg - `http://up.now.sh/google.com?json`.

```
GET https://up.now.sh/google.com?json
HTTP/1.1 200 OK

{"url":"google.com","status":"Up"}
```

# Contributing
If you'd like to contribute (you can skip a few of these steps if you'd like 😉): 
1. Clone the repo
2. Make a new local branch
3. Change what you'd like
4. Write some tests
5. Make a Pull Request!

✌️

# Deploy
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/hugomd/micro-up)

```
now hugomd/micro-up
```
