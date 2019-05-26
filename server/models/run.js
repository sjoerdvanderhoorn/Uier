var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Test = require("../models/test");

var RunSchema = new Schema({
    //test: ObjectId,
    test: { type: ObjectId, ref: "Test" },
    status: {
        type: String,
        enum: ["new", "running", "complete"]
    },
    created: Date,
    start: Date,
    end: Date,
    steps: [{
        screenshot: String,
        html: String,
        start: Date,
        end: Date
    }]
});

var Run = mongoose.model("Run", RunSchema);
module.exports = Run;