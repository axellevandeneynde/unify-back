const express = require('express');
const cors = require('cors');
const getNews = require('./news-collector/getNews');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())

const routes = require('./routes/index')(app);

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})

//--- update news every 30min --
setInterval(() => {
    console.log('updating news db');
    getNews()
}, 1800000)