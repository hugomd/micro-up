# Micro 🆙
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
Clone the repo, `yarn install`, `yarn run dev`, change what you'd like, and make a pull request ✌️

# Deploy
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/hugomd/micro-up)

```
now hugomd/micro-up
```
