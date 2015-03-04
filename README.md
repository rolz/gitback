# website

## [Project Info and Technical Resources](https://github.com/rolz/gitback/wiki)

## Development

Please do NOT commit anything in master branch besides permissions.

```
git checkout dev
npm i
gulp
```

Expose localhost with ngrok to enable github webhooks to work.

1. [Download ngrok](https://ngrok.com/)
2. Unzip and in command line
```
./ngrok 5000
```
3. copy the ngrok url from the terminal i.e. http://3da9c26d.ngrok.com/
4. [register new application in your github account](https://github.com/settings/applications) 
5. add any app name 
6. your homepage url: http://3da9c26d.ngrok.com/  
7. callback url is i.e. http://3da9c26d.ngrok.com/callback
8. Save your Client ID & Client Secret 
9. Do `echo "# Github" >> .env` file in root directory:
10. Then add to file with your own client id and secret:
```
CLIENTID=XXX
CLIENTSECRET=XXX
```
11. add .env extension to .gitignore file

access at: your ngrok url i.e. http://3da9c26d.ngrok.com/

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
