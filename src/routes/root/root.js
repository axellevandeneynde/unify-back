const express = require('express');
const app = express();
const path = require('path');

module.exports = function (app) {
    app.use(express.json());

    app.use('/', express.static('public'))

    app.get('/', (req, res) => {
        res.redirect('/index.html');
    })
}