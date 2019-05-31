var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Test = require("../models/test");

var RunSchema = new Schema({
    //test: ObjectId,
    test: { type: ObjectId, ref: "Test" },
    status: {
        type: String,
        enum: ["new", "running", "fail", "pass"]
    },
    url: String,
    created: Date,
    start: Date,
    end: Date,
    steps: [{
        name: String,
        command: String,
        target: { query: String, type: { type: String, enum: ["css", "id", "name", "className", "js", "linkText", "partialLinkText", "xpath"] } },
        value: String,
        code: String,
        expression: String,
        screenshot: String,
        html: String,
        start: Date,
        end: Date,
        error: String
    }]
});

var Run = mongoose.model("Run", RunSchema);
module.exports = Run;