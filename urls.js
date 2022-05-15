const mongoose = require('mongoose')
const Url = mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    date:{
        type: String, 
        default: Date.now()
    }
})
module.exports.Url = mongoose.model('Urls', Url)