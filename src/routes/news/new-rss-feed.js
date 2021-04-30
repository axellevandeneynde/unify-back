const express = require('express')
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
// const fs = require('fs');

module.exports = function (app) {

    app.use(express.json());

    app.post('/new-rss-feed', async (req, res) => {
        const rssFeed = req.body;

        console.log('submitted:');
        console.log(rssFeed);

        parseFeed(rssFeed);

        res.send("hello");
    });
}

async function parseFeed(rssFeed) {
    const url = rssFeed?.url
    const regio = rssFeed?.regio || [];
    const sourceName = rssFeed.name;

    const parsedFeed = [];
    const feed = fetch(url);
    const feedparser = new FeedParser([]);

    feed.then(function (res) {
        if (res.status !== 200) {
            throw new Error('Bad status code');
        }
        else {
            // The response `body` -- res.body -- is a stream
            res.body.pipe(feedparser);
        }
    }, function (err) {
        // handle any request errors
    });

    feedparser.on('error', function (error) {
        console.log("feedparser error in parseFeedAndSendToElastic()" + error);
    });

    feedparser.on('readable', async function () {
        var stream = this; // `this` is `feedparser`, which is a stream
        var item;

        while (item = stream.read()) {
            const article = formatArticle(item, regio, sourceName);
            parsedFeed.push(await article);
        }
    });

    feedparser.on('finish', function () {
        // fs.writeFileSync('parsedFeed.json', JSON.stringify(parsedFeed))
        console.log(parsedFeed);
    })

}

async function formatArticle(item, country, name) {
    return item
}