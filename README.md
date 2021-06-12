# Unify (back-end)

This repository contains the back-end for the project Unify. It is part of the Final Work of Axelle Vanden Eynde for the Bachelor Multimedia and Communication Technology at the Erasmus University College. 

A deployed version can be found [here](https://unify-back-express.herokuapp.com);
## Get it running locally

1. Clone this repository
2. run the command `npm install` to install the dependencies
3. run the command `npm run start` it will start the api on `http://localhost:3001`

## Routes

### Unprotected

**Get all news categories**

GET `/news-categories`

**Get all news locations/regions**

GET `/news-locations`

**Get all news sources**

GET `/news-sources`

**Get schijnwerper articles**

GET `/schijnwerper-articles`

**Add new rss feed**

POST `/new-rss-feed`

please respect the following body structure:
```
{
url:"",
name:"",
logo:"",
description:"",
language:"dutch",
"categories":[""],
"regions":[""],
"biased":"true" || "false"
}
```
It is strongly advised to add new rss routes by using the [admin platform](https://github.com/axellevandeneynde/unify-admin)

### Protected
These routes are only accesible through the [Unify front-end](https://github.com/axellevandeneynde/unify-front) by logged-in users.

**Bookmarks**
POST `/create-bookmark`
POST `/delete-bookmark`
POST `/get-bookmarks`

**Personal feeds**
POST `/create-new-feed` (can also be used to update feed)
POST `/get-user-feeds`

## Functions

This API is also able to manage news updates with the function `getNews()`. This function runs automatically every 30min. For it to work the [unify news tag generator](https://github.com/axellevandeneynde/unify-news-tag-generator) needs to be running locally. 

(in development) the `elasticUpdateAllTrust()` function updates every single document in the elastic search engine. This can take up all a lot of time as there are thousands of documents. Due to elastic API restrictions, it can only update up to 10 000 documents at a time. 











