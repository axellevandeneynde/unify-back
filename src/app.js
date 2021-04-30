const express = require('express')
const app = express()
const cors = require('cors');
const routes = require('./routes/index')(app);

const port = process.env.PORT || 3000;

var corsOptions = {
    origin: 'http://localhost:3000/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})