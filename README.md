# website

## [Project Info and Technical Resources](https://github.com/rolz/gitback/wiki)

## Development

Please do NOT commit anything in master branch besides permissions.

```
git checkout dev
npm i
gulp
```

## Setup

### Install Gulp

```
npm i gulp -g
```

###Expose localhost with ngrok to enable github webhooks to work.

* [Download ngrok](https://ngrok.com/)
* Unzip and in command line
```
./ngrok 5000
```
* copy the ngrok url from the terminal i.e. http://3da9c26d.ngrok.com/ (use your created ngrok url)
* [register new application in your github account](https://github.com/settings/applications)
* add any app name
* insert your homepage url: http://3da9c26d.ngrok.com/  
* insert callback url is i.e. http://3da9c26d.ngrok.com/callback
* Take note of your Client ID & Client Secret for later
* Go to the app directory root and `echo "# Github" >> .env`
* Then in editor add following to .env file:
```
CLIENTID=XXX
CLIENTSECRET=XXX
WEBHOOKURL=http://3da9c26d.ngrok.com/webhook
```

* Your Done! Access at: your ngrok url i.e. http://3da9c26d.ngrok.com/
* To check if working go to /login and check terminal for user logs.

## Braintree Test Sandbox

https://sandbox.braintreegateway.com/login
username: gitback
password: sheherher01

## gitback.org/admin

username: gitback
password: sherherher01

## Deployment

Please ask @mayognaise to add your email to heroku app.

(We are going to prepare two apps for development and production later.)

```
// Login to heroku
heroku login

// Make sure all stuff has been commited.
// It does NOT have to be pushed to remote.
git push heroku dev:master

// Open the app in browser
heroku open

// Log with tail
heroku logs -t
```
