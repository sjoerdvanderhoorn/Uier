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
        urlDomain: String,
        status: {
            type: String,
            enum: ["new", "running", "fail", "pass"]
        },
        run: { type: ObjectId, ref: "Run" }
    }]
});

var Collection = mongoose.model("Collection", CollectionSchema);
module.exports = Collection;