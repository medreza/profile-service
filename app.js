'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connect } = require('./db');
const { swaggerUi, specs } = require('./swagger');

// Connect to database
if (process.env.NODE_ENV !== 'test') {
    connect();
}

// middleware
app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// routes
app.use('/profiles', require('./routes/profile')());
app.use('/profiles/:profileId/comments', require('./routes/comment')());
app.use('/users', require('./routes/user')());
app.use('/personalities', require('./routes/personality')());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Default route for home page (optional, but good for demo)
app.get('/', (req, res) => res.redirect('/profiles'));

// start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log('Express started. Listening on %s', port);
    });
}

module.exports = app;
