var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Test = require("../models/test");

var CollectionSchema = new Schema({
    name: String,
    description: String,
    created: Date,
    updated: Date,
    tests: [{
        test: { type: ObjectId, ref: "Test" },
        browser: String,
        baseUrl: String
    }]
});

var Collection = mongoose.model("Collection", CollectionSchema);
module.exports = Collection;