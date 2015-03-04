# website

## [Project Info and Technical Resources](https://github.com/rolz/gitback/wiki)

## Development

Please do NOT commit anything in master branch besides permissions.

```
git checkout dev
npm i
gulp
```
localhost:5000


Expose localhost with ngrok to enable github webhooks to work.

1. [download ngrok](https://ngrok.com/)
2.
```
./ngrok 5000
```



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
