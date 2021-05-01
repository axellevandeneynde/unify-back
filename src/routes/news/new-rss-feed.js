const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
const getNews = require('../../news-collector/getNews');
// const fs = require('fs');

module.exports = function (app) {

    app.use(express.json());

    app.post('/new-rss-feed', async (req, res) => {
        const rssFeedInfo = req.body;

        console.log('submitted:');
        console.log(rssFeedInfo);

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            const newsSources = client.db("unify").collection("newsSources");
            // check if rss feed is already in db
            newsSources.findOne({ url: rssFeedInfo.url }, (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({
                        "status": "something went wrong (1)"
                    });
                    client.close();
                }
                if (_.isNil(result)) {
                    newsSources.insertOne(rssFeedInfo, (err, response) => {
                        if (err) {
                            res.send({
                                "status": "something went wrong (2)"
                            });
                        }
                        res.send({
                            "status": "added to DB"
                        });
                        client.close();
                        getNews();
                    })
                } else {
                    res.send({
                        "status": "this rss feed already exists, check the url"
                    });
                    getNews();
                    client.close();
                }
            });
        });
    });
}