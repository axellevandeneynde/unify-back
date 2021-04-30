const express = require('express')
const app = express()
const cors = require('cors');

const port = process.env.PORT || 3000;

app.use(cors())

const routes = require('./routes/index')(app);

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})