module.exports = (app) => {
    require('./user/hello')(app);
    require('./user/bye')(app);
}