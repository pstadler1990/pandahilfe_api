'use strict';

const MongooseAutoIncrementID = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
const config = require('../../config');
const helpers = require('../helpers');
const mongoose = require('mongoose');

const re = /\S+@\S+\.\S+/;

const helpEntrySchema = new mongoose.Schema({
    entry_id: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    location: {
        type: [String],
        enum: config.locations,
        default: config.locations[0],
    },
    distance: {
        type: Number,
        default: 10
    },
    tags: {
        type:  [String],
        enum: config.tags,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    isAnonymously: {
        type: Boolean,
        default: false
    },
    deleteCode: {
        type: String
    }
}, { collection: 'help_entry' });

const options = {
    field: 'entry_id',
    incrementBy: 1,
    nextCount: false,
    startAt: 100,
    unique: true
};

const plugin = new MongooseAutoIncrementID(helpEntrySchema, 'HelpEntry', options);
plugin.applyPlugin().then();

/* Validation */
helpEntrySchema.pre('save', function(next) {
    let entry = this;

    if(entry.email && re.test(entry.email)) {
        helpers.generateDeleteCode().then(code => {
            entry.deleteCode = code;
            next();
        });
    } else{
        next(null);
    }
});

module.exports = exports = mongoose.model('HelpEntry', helpEntrySchema);