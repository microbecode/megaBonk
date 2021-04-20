API built with NodeJS and Express

# Instructions

1. Install dependencies: 

```
npm install
```

2. Create .env file in root directory with the same content as in .env.example (replace <...> with real values).

3. Start the server:

```
npm start
```

or

```
nodemon start
```

4. Visit http://localhost:8080/api (PORT number 8080 may be different depending on your env variables)


## Heroku

Push changes to Heroku:

```
git push heroku main
```

Open in browser:

```
heroku open
```

View logs:

```
heroku logs --tail
```

Don't forget to set .env variables in Heroku.
