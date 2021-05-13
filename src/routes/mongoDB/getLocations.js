const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

module.exports = function (app) {

    app.use(express.json());

    app.get('/news-locations', async (req, res) => {

        console.log('locations requested');

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const locationsCollection = client.db("unify").collection("newsLocations");
            locationsCollection.find({}, async (err, result) => {
                if (err) {
                    res.send([])
                    console.log('failed to return locations');
                }
                const locationObjects = await result.toArray();
                const locations = locationObjects.map(location => location.locationName);
                res.send(locations);
                console.log('locations send');
                client.close()
            })
        }
        )
    })
}