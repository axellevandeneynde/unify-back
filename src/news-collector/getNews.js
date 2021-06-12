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
                fetch('http://127.0.0.1:5000/generateDutchLabels', {
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
    const now = new Date();
    const placeHolderDescription = '<ul><li>Dit zijn de aandachtspunten voor de betrouwbaarheid van deze bron. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li><li>Praesent scelerisque vel arcu non porttitor. Phasellus nec pretium eros. </li><li>Maecenas elit erat, lobortis et dictum vitae, dignissim eu magna.</li></ul>'
    let trust;
    switch (rssFeedInfo.name) {
        case 'De Tijd':
        case 'De Standaard':
        case 'De Morgen':
        case 'vrt nws':
            trust = {
                score: 9,
                description: placeHolderDescription,
                written_by: 'Jan Janssens',
                last_update: now.toISOString()
            }
            break;
        case 'Het Belang van Limburg':
        case 'Gazet van Antwerpen':
        case 'Het Nieuwsblad':
        case 'Bruzz':
        case 'Het Laatste Nieuws':
            trust = {
                score: 8,
                description: placeHolderDescription,
                written_by: 'Jane dhoe',
                last_update: now.toISOString()
            }
        case 'MO':
        case 'MO*':
            trust = {
                score: 7,
                description: placeHolderDescription,
                written_by: 'Jane dhoe',
                last_update: now.toISOString()
            }
        case 'Apache':
        case 'Doorbraak':
        case 'De Wereld Morgen':
            trust = {
                score: 5,
                description: placeHolderDescription,
                written_by: 'Axelle Vanden Eynde',
                last_update: now.toISOString()
            }
            break;

        default:
            trust = {
                score: 7,
                description: placeHolderDescription,
                written_by: 'Axelle Vanden Eynde',
                last_update: now.toISOString()
            }
            break;
    }

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
        biased: rssFeedInfo.biased,
        trust_score: trust.trust_score,
        trust_description: trust.trust_description,
        trust_written_by: trust.trust_written_by,
        trust_last_update: trust.trust_last_update,
    }
}

function sendArticlesToElastic(articles) {
    const elasticUrl = 'https://enterprise-search-deployment-2e3053.ent.westeurope.azure.elastic-cloud.com/api/as/v1/engines/unify/rssFeedInfouments';
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