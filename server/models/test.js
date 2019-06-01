var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TestSchema = new Schema({
    name: String,
    purpose: String,
    urlDomain: String,
    urlPath: String,
    created: Date,
    updated: Date,
    steps: [{
        name: String,
        command: String,
        target: { query: String, type: { type: String, enum: ["css", "id", "name", "className", "js", "linkText", "partialLinkText", "xpath"] } },
        value: String,
        code: String,
        expression: String
    }]
});

var Test = mongoose.model("Test", TestSchema);
module.exports = Test;