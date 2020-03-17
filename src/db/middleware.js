const config = require('../config');

exports.ensureOrigin = function(req, res, next) {
    /* Ensure, we only accept requests from an allowed host */
    // const origin = req.get('origin');
    const host = req.get('host');

    if(config.allowHosts.includes(host)) {
        next();
    }
    else {
        console.warn('Received request from bad host', host);
        return res.status(400).json({'ok' : false, 'error' : 'api_error_bad_host'});
    }
};