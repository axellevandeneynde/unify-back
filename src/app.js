const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/index')(app);

app.listen(port, () => {
    console.log(`Unify-back listening at http://localhost:${port}`)
})