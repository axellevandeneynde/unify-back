module.exports = (app) => {
    require('./news/new-rss-feed')(app);
    require('./news/schijnwerperArticles')(app);
    require('./mongoDB/getLocations')(app);
    require('./root/root')(app);
}