require("dotenv-safe").config();
const express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 3001;


app.use('/', (req, res, next) => {
    res.json([{ id: 1, title: 'The Sims' }, { id: 2, title: 'Grand Theft Auto' }]);
})

app.listen(port, () => { console.log('Games running at ' + port) });