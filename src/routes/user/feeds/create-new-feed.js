const MongoClient = require('mongodb').MongoClient;
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');

module.exports = function (app, authenticated) {

    app.post('/create-new-feed', authenticated, function (req, res) {
        let feed = req.body.feed;
        console.log(req.body.feed);
        if (_.isNil(feed.id)) {
            feed.id = uuidv4();
        }
        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const userCollection = client.db("unify-users").collection("users");
            userCollection.updateOne(
                { id: req.body.user.email },
                { $pull: { feeds: { id: feed.id } } },
                async (err) => console.log(err)
            );
            userCollection.updateOne(
                { id: req.body.user.email },
                { $push: { feeds: feed } },
                { upsert: true },
                async (err, result) => {
                    if (err) {
                        res.send({ status: 'create feed failed' })
                        console.log('failed to create user feed');
                    }
                    res.send({
                        status: 'new user feed created',
                        feedId: feed.id
                    });
                    client.close()
                })
        })
    });
}