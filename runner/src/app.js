const fetch = require('node-fetch');
const runner = require("./runner.js");

var loop = {
    newRun: async function(run) {
        console.log("Running", run.uid);
        // Set status to "running"
        fetch("http://localhost:8081/run/" + run.uid, {
            method: "PATCH",
            body: JSON.stringify({
                status: "running",
                start: new Date()
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        // Run test
        var results = await runner.run(run);
        // Process and save results
        run.status = results.status;
        run.end = new Date();
        run.steps = results.steps;
        fetch("http://localhost:8081/run/" + run.uid, {
            method: "PUT",
            body: JSON.stringify(run),
            headers: {
                "Content-Type": "application/json"
            }
        });
    },
    checkNewRun: function() {
        fetch("http://localhost:8081/run/next")
            .then(function(response) {
                return response.text();
            })
            .then(async function(run) {
                // Process runs
                if (run.length > 0) {
                    // Execute
                    await loop.newRun(JSON.parse(run));
                }
            })
            .catch(function(error) {
                console.log(error.toString());
            });
        // Wait for next run
        loop.checkNewRunTimeout();
    },
    checkNewRunTimeout: function() {
        setTimeout(function() { loop.checkNewRun(); }, 5000);
    }
}

loop.checkNewRun();