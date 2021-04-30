const express = require('express')
const app = express()
const cors = require('cors');
const routes = require('./routes/index')(app);

const port = process.env.PORT || 3000;

app.use(cors())

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})