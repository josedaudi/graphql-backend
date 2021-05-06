const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    comment: String,
    userId: String
});

module.exports = mongoose.model('Post', postSchema);