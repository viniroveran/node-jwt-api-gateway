require("dotenv-safe").config();
const express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 3002;

app.use('/', (req, res, next) => {
    res.json([{ id: 1, title: 'Honda Civic' }, { id: 2, title: 'Audi Q3' }]);
})

app.listen(port, () => { console.log('Cars running at ' + port) });