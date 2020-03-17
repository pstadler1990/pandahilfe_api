'use strict';

const HelpEntry = require('./db/models/help_entry.js'),
    Middleware = require('./db/middleware');

module.exports = function(server) {

    server.get('/entry', Middleware.ensureOrigin, function(req, res) {
        /* List all entries */
        let findQuery = {};
        if(req.query.location) {
            findQuery = {'location': req.query.location};
        }
        if(req.query.tag) {
            findQuery = {
                ...findQuery,
                'tags': req.query.tag
            }
        }

        HelpEntry.find(findQuery, function(err, entries) {
            if(err)
                res.status(400).json({'ok' : false, 'error' : 'api_error_entry_get'});
            else
                res.status(200).json({'ok' : true, entries});
        });
    });

    server.post('/entry', Middleware.ensureOrigin, function(req, res) {
        /* Insert help entry */
        let body = req.body;

        if(body) {
            let status, response;
            HelpEntry.create(body, function (err, entry) {
                if (!err) {
                    status = 201;
                    response = { 'ok': true, 'id': entry._id,  'entry_id': entry.entry_id, 'deleteCode': entry.deleteCode };
                }
                else {
                    status = 400;
                    response = {'ok': false, 'error': 'api_error_entry'};
                }
                res.status(status).json(response);
            });
        }
    });

};