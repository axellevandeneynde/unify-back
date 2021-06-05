const express = require('express')
const MongoClient = require('mongodb').MongoClient;

module.exports = function (app) {

    app.use(express.json());

    app.get('/news-categories', async (req, res) => {

        console.log('categories requested');

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const categoriesCollection = client.db("unify").collection("newsCategories");
            categoriesCollection.find({}, async (err, result) => {
                if (err) {
                    res.send([])
                    console.log('failed to return categories');
                }
                const categories = await result.toArray();
                res.send(categories);
                console.log('categories send');
                client.close()
            })
        }
        )
    })
}