module.exports = (app, authenticated) => {
    require('./news/new-rss-feed')(app);
    require('./news/schijnwerperArticles')(app);

    require('./mongoDB/getLocations')(app);
    require('./mongoDB/getCategories')(app);
    require('./mongoDB/getSources')(app);

    require('./user/feeds/create-new-feed')(app, authenticated);
    require('./user/check-new-user')(app, authenticated);
    require('./user/feeds/get-user-feeds')(app, authenticated);

    require('./root/root')(app);
}