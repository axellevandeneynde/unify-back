const MongoClient = require('mongodb').MongoClient;

module.exports = function (app, authenticated) {

    app.post('/delete-bookmark', authenticated, function (req, res) {
        const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.7pkgd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(async err => {
            console.log(err);
            const userCollection = client.db("unify-users").collection("users");
            console.log('delete: ');
            console.log(req.body);
            userCollection.updateOne(
                { id: req.body.user.email },
                { $pull: { bookmarks: req.body.bookmark } },
                { upsert: true },
                async (err, result) => {
                    if (err) {
                        res.send({ status: 'create bookmark failed' })
                        console.log('failed to create bookmark');
                    }
                    res.send({ status: 'bookmark deleted' });
                    client.close()
                })
        })
    })
};