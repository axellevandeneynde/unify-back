const MongoClient = require('mongodb').MongoClient;

module.exports = function (app, authenticated) {

    app.post('/create-new-feed', authenticated, function (req, res) {
        console.log(req.body);

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const userCollection = client.db("unify-users").collection("users");
            userCollection.updateOne(
                { id: req.body.user.email },
                { $push: { feeds: req.body.feed } },
                { upsert: true },
                async (err, result) => {
                    if (err) {
                        res.send({ status: 'create feed failed' })
                        console.log('failed to create user feed');
                    }
                    res.send({ status: 'new user feed created' });
                    client.close()
                })
        })
    });
}