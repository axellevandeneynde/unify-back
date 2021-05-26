const MongoClient = require('mongodb').MongoClient;

module.exports = function (app, authenticated) {

    app.post('/get-user-feeds', authenticated, function (req, res) {
        console.log(req.body);

        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const userCollection = client.db("unify-users").collection("users");
            userCollection.findOne(
                { id: req.body.email },
                async (err, result) => {
                    if (err) {
                        res.send([])
                        console.log('failed to get user feed');
                    }
                    res.send(result.feeds);
                    client.close()
                })
        })
    });
}