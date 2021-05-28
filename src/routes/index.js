module.exports = (app, authenticated) => {
    require('./news/new-rss-feed')(app);
    require('./news/schijnwerperArticles')(app);

    require('./mongoDB/getLocations')(app);
    require('./mongoDB/getCategories')(app);
    require('./mongoDB/getSources')(app);

    require('./user/check-new-user')(app, authenticated);
    require('./user/feeds/create-new-feed')(app, authenticated);
    require('./user/feeds/get-user-feeds')(app, authenticated);

    require('./user/bookmarks/create-bookmark')(app, authenticated);
    require('./user/bookmarks/delete-bookmark')(app, authenticated);
    require('./user/bookmarks/get-bookmarks')(app, authenticated);

    require('./root/root')(app);
}