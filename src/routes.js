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

        HelpEntry.find(findQuery, { deleteCode: 0}, function(err, entries) {
            if(err)
                res.status(400).json({'ok' : false, 'error' : 'api_error_entry_get'});
            else {
                for(let k in entries){
                    /* Remove fields */
                    if(entries[k]['isAnonymously']) {
                        entries[k]['name'] = undefined;
                        entries[k]['phone'] = undefined;
                    }
                }
                res.status(200).json({'ok' : true, entries});
            }
        });
    });

    server.post('/entry', Middleware.ensureOrigin, function(req, res) {
        /* Insert help entry */
        let body = req.body;

        if(body) {
            let status, response;

            if(body.location === 'Regensburg') {
                /* If user chooses Regensburg (city), all districts will be automatically selected */
                body.location = [
                    'Regensburg',
                    'R-Innenstadt',
                    'R-Stadtamhof',
                    'R-Steinweg - Pfaffenstein',
                    'R-Sallern - Gallingkofen',
                    'R-Konradsiedlung - Wutzlhofen',
                    'R-Brandlberg - Keilberg',
                    'R-Reinhausen',
                    'R-Weichs',
                    'R-Schwabelweis',
                    'R-Ostenviertel',
                    'R-Kasernenviertel',
                    'R-Galgenberg',
                    'R-Kumpfmühl - Ziegetsdorf - Neuprüll',
                    'R-Großprüfening - Dechbetten - Königswiesen',
                    'R-Westenviertel',
                    'R-Ober- und Niederwinzer - Kager',
                    'R-Oberisling - Graß',
                    'R-Burgweinting - Harting',
                ];
            }

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