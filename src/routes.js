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
        } else {
            res.status(400).json({'ok' : false, 'error' : 'api_error_entry'});
        }
    });

    server.post('/entry/:id', Middleware.ensureOrigin, function(req, res) {
        /* Request for mail contact */
        let body = req.body;
        let entry_id = req.params.id;

        if(body) {
            HelpEntry.findOne({ 'entry_id': entry_id},  function(err, entry) {
                if(err)
                    res.status(400).json({'ok' : false, 'error' : 'api_error_entry_post_id'});
                else {
                    // TODO: Create email with user data from request
                    // Email contains:
                    // Name body.name
                    // https://nodemailer.com/about/
                    res.status(200).json({'ok' : true});
                }
            });
        } else {
            res.status(400).json({'ok' : false, 'error' : 'api_error_entry_post_id'});
        }
    });

    server.delete('/entry/:id', Middleware.ensureOrigin, function(req, res) {
        /* Request for mail (delete entry) */
        let body = req.body;
        let entry_id = req.params.id;
        let deleteCode = body.code;

        if(body && entry_id && deleteCode) {
            HelpEntry.findOne({ 'entry_id': entry_id, 'deleteCode': deleteCode},  function(err, entry) {
                if(err)
                    res.status(400).json({'ok' : false, 'error' : 'api_error_entry_delete_id'});
                else {
                    if(entry) {
                        // TODO: Create email with entry id
                        // Email contains:
                        // Name body.name
                        // https://nodemailer.com/about/
                    }
                    /* Always respond with 200 OK even if the delete code was wrong*/
                    res.status(200).json({'ok' : true});
                }
            });
        } else {
            res.status(400).json({'ok' : false, 'error' : 'api_error_entry_post_id'});
        }
    });

};