const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

module.exports = function (app) {

    app.use(express.json());

    app.get('/schijnwerper-articles', async (req, res) => {

        console.log('schijnwerper articles requested');

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            const articles = client.db("unify").collection("schijnwerper");
            const ids = await articles.find({}).toArray()
            const articleIds = ids.map(item => item.articleId);
            axios('https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer private-txvmuhndnkhx9an5eqybky8b`
                },
                data: articleIds
            }).then(art => {
                console.log(art);
                res.send(art.data);
            }).catch(err => {
                console.log(err);
                res.send([]);
            })
        }
        )
    })
}