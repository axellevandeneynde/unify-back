module.exports = (app) => {
    require('./news/new-rss-feed')(app);
    require('./news/schijnwerperArticles')(app);
    require('./mongoDB/getLocations')(app);
    require('./mongoDB/getCategories')(app);
    require('./mongoDB/getSources')(app);
    require('./root/root')(app);
}