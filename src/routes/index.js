module.exports = (app) => {
    require('./news/new-rss-feed')(app);
    require('./root/root')(app);
}