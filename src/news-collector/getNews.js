const FeedParser = require('feedparser');
const fetch = require('node-fetch');

module.exports = async function getNews() {

    //--- get news sources from mongoDB ---
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://axelle:unifymongodb140@cluster0.ipi5k.mongodb.net/unify?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if (err) throw err;

        const collection = client.db("unify").collection("newsSources");
        collection.find({}).toArray((err, result) => {
            if (err) throw err;
            const newsSources = result;
            client.close();

            //--- loop over sources and save articles from rss in elastic ---
            for (const source of newsSources) {
                saveArticles(source)
            }
        })

    })
};


function saveArticles(rssFeedInfo) {

    const articles = [];

    //--- parse rss feed to JSON ---
    const feed = fetch(rssFeedInfo.url);
    const feedparser = new FeedParser([]);

    feed.then(function (res) {
        if (res.status !== 200) {
            throw new Error('Bad status code, fetching rss feed');
        }
        else {
            res.body.pipe(feedparser);
        }
    }, function (err) {
        console.log(err);
    });

    feedparser.on('error', function (error) {
        console.log("feedparser error:" + error);
    });

    feedparser.on('readable', async function () {
        var stream = this; // `this` is `feedparser`, which is a stream
        var item;

        while (item = stream.read()) {
            //--- filter info + add source info to article --
            const article = formatArticle(item, rssFeedInfo);
            articles.push(await article);
        }
    });

    feedparser.on('finish', function () {
        console.log(`parsed ${rssFeedInfo.name}`);

        //--- label articles and send to elastic ---
        try {
            if (articles.length > 0) {
                fetch('https://unify.pythonanywhere.com/generateDutchLabels', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articles)
                }).then(async res => {
                    sendArticlesToElastic(await res.json())
                }).catch(err => {
                    console.log("error in fetching labels:" + err)
                })
            }
        } catch (e) {
            console.log(e)
            console.log("failed to get labels and to push to elastic")
        }
    })

}

function formatArticle(item, rssFeedInfo) {
    return {
        url: item.link,
        description: item.summary || item.description || '',
        date: item.pubdate,
        image: item.image?.url || item.enclosures[0]?.url || '',
        title: item.title,
        labels: [],
        id: item.guid || item.link,
        rss_categories: item.categories,
        source_logo: rssFeedInfo.logo,
        source_name: rssFeedInfo.name,
        source_description: rssFeedInfo.description,
        source_website: rssFeedInfo.website,
        source_categories: rssFeedInfo.categories,
        source_regions: rssFeedInfo.regions,
        biased: rssFeedInfo.biased
    }
}

function sendArticlesToElastic(articles) {
    const elasticUrl = 'https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/documents';
    fetch(elasticUrl, {
        method: 'post',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer private-txvmuhndnkhx9an5eqybky8b",
        },
        body: JSON.stringify(articles)
    }).then(async res => {
        // console.log(await res.json());
    }).catch(err => {
        console.log("error in sending data to elasticsearch:" + err)
    })

}