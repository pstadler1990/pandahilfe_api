const config = Object.freeze({
    __ENV__ : 'DEV',
    maintenance : false,
    frontendBuild: {
        'major': 0,
        'minor': 1
    },
    serverPort : 3010,
    db: {
        url: 'mongodb://panda:panda@192.168.188.74:27017/pandahilfe?authSource=pandahilfe'
    },
    allowHosts: [
        '192.168.188.72:3010'
    ],
    tags: [
        'Einkaufshilfe',
        'Kinderbetreuung',
        'Allgemeine Tätigkeiten',
        'Persönliche Betreuung',
        'Haustierbetreuung',
    ],
    locations: [
        'Regensburg',
        'Alteglofsheim',
        'Altenthann',
        'Aufhausen',
        'Bach a. d. Donau',
        'Barbing',
        'Beratzhausen',
        'Bernhardswald',
        'Brennberg',
        'Brunn',
        'Deuerling',
        'Donaustauf',
        'Duggendorf',
        'Hagelstadt',
        'Hemau',
        'Holzheim a. Forst',
        'Kallmünz',
        'Köfering',
        'Laaber',
        'Lappersdorf',
        'Mintraching',
        'Mötzing',
        'Neutraubling',
        'Nittendorf',
        'Obertraubling',
        'Pentling',
        'Pettendorf',
        'Pfakofen',
        'Pfatter',
        'Pielenhofen',
        'Regenstauf',
        'Riekofen',
        'Schierling',
        'Sinzing',
        'Sünching',
        'Tegernheim',
        'Thalmassing',
        'Wenzenbach',
        'Wiesent',
        'Wörth a. d. Donau',
        'Wolfsegg',
        'Zeitlarn',
    ]
});

module.exports = config;