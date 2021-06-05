const MongoClient = require('mongodb').MongoClient;

module.exports = function (app, authenticated) {

    app.post('/check-new-user', authenticated, function (req, res) {
        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const userCollection = client.db("unify-users").collection("users");
            userCollection.updateOne(
                { id: req.body.email },
                { $set: { id: req.body.email } },
                { upsert: true },
                async (err, result) => {
                    if (err) {
                        res.send({ status: 'check failed' })
                        console.log('failed to check user');
                    }
                    res.send({ status: 'checked' });
                    client.close()
                })
        }
        )
    })
};

