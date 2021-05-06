const mongoose = require('mongoose');

const hobbySchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String
});

module.exports = mongoose.model('Hobby', hobbySchema);