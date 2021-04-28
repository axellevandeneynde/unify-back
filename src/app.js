const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const routes = require('./routes/index')(app);

app.listen(port, () => {
    console.log(`Unify-back listening at port ${port}`)
})