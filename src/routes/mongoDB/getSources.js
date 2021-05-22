const express = require('express')
const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {

    app.use(express.json());

    app.get('/news-sources', async (req, res) => {

        console.log('sources requested');

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const sourcesCollection = client.db("unify").collection("newsSources");
            sourcesCollection.find({}, async (err, result) => {
                if (err) {
                    res.send([])
                    console.log('failed to return sources');
                }
                const sources = await result.toArray();
                res.send(sources);
                console.log('sources send');
                client.close()
            })
        }
        )
    })
}