const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const getNews = require('./news-collector/getNews');
const elasticUpdateAllTrust = require('./elastic-manager/update-all-trust');

const app = express();
const port = process.env.PORT || 3001;

const authConfig = {
    issuer: 'https://dev--gys6ql4.eu.auth0.com/',
    aud: process.env.REACT_APP_UNIFY_BACK,
    algorithms: ['RS256'],
};

const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${authConfig.issuer}.well-known/jwks.json`,
});

const authenticated = jwt({ secret, ...authConfig });


app.use(cors())

const routes = require('./routes/index')(app, authenticated);

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})

//--- update news every 30min --
setInterval(() => {
    console.log('updating news db');
    getNews()
}, 1800000)