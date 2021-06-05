const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

module.exports = function (app, authenticated) {

    app.use(express.json());

    app.post('/get-bookmarks', authenticated, async (req, res) => {

        console.log('bookmarks requested');

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const articles = client.db("unify-users").collection("users");
            const userData = await articles.findOne({ id: req.body.user.email })
            const articleIds = userData.bookmarks
            axios('https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer private-txvmuhndnkhx9an5eqybky8b`
                },
                data: articleIds
            }).then(art => {
                res.send(art.data);
                client.close()
            }).catch(err => {
                console.log(err);
                res.send([]);
                client.close()
            })
        }
        )
    })
}