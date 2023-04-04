require("dotenv").config();
const express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 6000;

app.use('/', (req, res, next) => {
    res.json([{ id: 1, title: 'Honda Civic' }, { id: 2, title: 'Audi Q3' }]);
})

app.listen(port, () => { console.log('Fake Cars running on port ' + port) });