'use strict';

const HelpEntry = require('./db/models/help_entry.js'),
    Middleware = require('./db/middleware'),
    transporter = require('./mailer');
const configMail = require("./config.mail");

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
            } else if(body.location === 'Würzburg') {
                body.location = [
                    'Würzburg',
                    'W-Altstadt',
                    'W-Zellerau',
                    'W-Dürrbachtal',
                    'W-Grombühl',
                    'W-Lindleinsmühle',
                    'W-Frauenland',
                    'W-Sanderau',
                    'W-Heidingsfeld',
                    'W-Heuchelhof',
                    'W-Steinbachtal',
                    'W-Versbach',
                    'W-Lengfeld',
                    'W-Rottenbauer',
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
                    if(entry['email']) {
                        transporter.sendMail({
                            from: configMail.sender,
                            to: entry['email'],
                            replyTo: body.email,
                            subject: "Nachbarschaftshilfe PANDAHILFE - ANFRAGE",
                            text: `Hallo liebe*r Helfer*in! Jemand, der deine Hilfe benötigt, hat dir eine Kontaktanfrage auf PANDAHILFE Regensburg gestellt.
                            Hier sind seine / Ihre Kontaktdaten:
                            ------------------------------------
                            Name: ${body.name}
                            E-Mail: ${body.email}
                            Telefon: ${body.phone}
                            -------------------------------------
                            
                            Es ging um deine Anzeige #${entry['entry_id']}: ${entry['tags']} in ${entry['location']}.
                            Vielen Dank für deine Mithilfe!
                            `,
                            html: `<h3>Hallo liebe*r Helfer*in!</h3>
                            <p>Jemand, der deine Hilfe benötigt, hat dir eine Kontaktanfrage auf PANDAHILFE Regensburg gestellt.</p>
                            <p>Hier sind seine / Ihre Kontaktdaten:</p>
                            <br />
                            ------------------------------------<br />
                            Name: ${body.name}<br />
                            E-Mail: ${body.email}<br />
                            Telefon: ${body.phone}<br />
                            -------------------------------------<br />
                            
                            <p>Es ging um deine Anzeige #${entry['entry_id']}: ${entry['tags']} in ${entry['location']}</p>
                         
                            <h4>Vielen Dank für deine Mithilfe!</h4>
                            `
                        }).then(() => {
                            res.status(200).json({'ok' : true});
                        }).catch(() => {
                            res.status(400).json({'ok' : false});
                        });
                    } else {
                        res.status(400).json({'ok' : false, 'error' : 'api_error_entry_post_id'});
                    }
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
                        transporter.sendMail({
                            from: 'pandahilfe-rgb@gmx.de',
                            to: configMail.deleteReceivers,
                            subject: "✗ Löschfrage PANDAHILFE ✗",
                            text: `Bitte um Löschung der Anzeige ${entry['entry_id']} (Löschcode ${entry['deleteCode']})`,
                        }).then(() => {
                            res.status(200).json({'ok' : true});
                        }).catch(() => {
                            res.status(400).json({'ok' : false});
                        });
                    } else {
                        /* Always respond with 200 OK even if the delete code was wrong*/
                        res.status(200).json({'ok' : true});
                    }
                }
            });
        } else {
            res.status(400).json({'ok' : false, 'error' : 'api_error_entry_post_id'});
        }
    });

};