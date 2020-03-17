'use strict';

const config = require('./config'),
    express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    fs = require('fs'),
    https = require('https');

const PandaAPI = function () {
    const entryRoutes = require('./routes');
    const sslConfig = (config.__ENV__ === 'PROD') ? require('./config.ssl') : null;

    let app;
    PandaAPI.prototype.init = function () {
        let options = (config.__ENV__ === 'PROD' && sslConfig) ? {
            ca: fs.readFileSync(sslConfig.PATH_TO_BUNDLE_CERT),
            cert: fs.readFileSync(sslConfig.PATH_TO_CERT),
            key: fs.readFileSync(sslConfig.PATH_TO_KEY)
        } : null;

        app = express();
        app.use(express.json());
        app.use(express.urlencoded({extended: true}));

        /*Cross-Origin Resource Sharing*/
        app.use(cors());

        mongoose.connect(config.db.url, {useNewUrlParser: true});
        const dbConnection = mongoose.connection;

        dbConnection.on('error', console.error.bind(console, 'connection error:'));
        dbConnection.once('open', function () {
            console.log('Connected to mongodb@', config.db.url);

            if (config.__ENV__ === 'PROD' && sslConfig) {
                let server = https.createServer(options, app);
                server.listen(config.serverPort, () => {
                    console.log('Listening on secured port ', config.serverPort);
                });
            } else {
                app.listen(config.serverPort, function () {
                    console.log('Listening on port ', config.serverPort);
                });
            }

            provideAPI();
        });
    };

    const provideAPI = function () {
        /* Actual API */
        app.get('/', function (req, res) {
            res.status(200).json({'ok': true});
        });

        entryRoutes(app);
    }
};

new PandaAPI().init();