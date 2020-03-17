const generateDeleteCode = function() {
    return new Promise(function (resolve) {
        resolve('xxxx'.replace(/[xy]/g, function (c) {
            const r = Math.floor(Math.random() * 9);
            return r.toString();
        }));
    });
};

module.exports = generateDeleteCode;