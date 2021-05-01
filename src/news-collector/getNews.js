module.exports = function getNews() {

    //get news sources from mongoDB
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("unify").collection("newsSources");
        // perform actions on the collection object
        client.close();
    });



    //loop over sources and parse their rss feeds

    //Push new articles to elastic
}


// async function parseFeed(rssFeedInfo) {
//     const parsedFeed = [];
//     const feed = fetch(rssFeedInfo.url);
//     const feedparser = new FeedParser([]);

//     //get feed
//     feed.then(function (res) {
//         if (res.status !== 200) {
//             throw new Error('Bad status code');
//         }
//         else {
//             res.body.pipe(feedparser);
//         }
//     }, function (err) {
//         console.log(err);
//     });

//     feedparser.on('error', function (error) {
//         console.log("feedparser error:" + error);
//     });

//     //parse feed
//     feedparser.on('readable', async function () {
//         var stream = this; // `this` is `feedparser`, which is a stream
//         var item;

//         while (item = stream.read()) {
//             const article = formatArticle(item, rssFeedInfo);
//             parsedFeed.push(await article);
//         }
//     });

//     feedparser.on('finish', function () {
//         // fs.writeFileSync('parsedFeed.json', JSON.stringify(parsedFeed))
//         console.log(parsedFeed);
//     })

// }

// async function formatArticle(item, rssFeedInfo) {
//     return item
// }