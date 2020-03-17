'use strict';

const HelpEntry = require('./db/models/help_entry.js'),
    Middleware = require('./db/middleware');

module.exports = function(server) {

    server.post('/entry', Middleware.ensureOrigin, function(req, res) {

        let body = req.body;

        if (body) {

        }
    });

};