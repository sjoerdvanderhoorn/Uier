const fetch = require('node-fetch');
const runner = require("./src/runner.js");

var loop = {
    newRun: async function(run) {
        console.log("Running", run._id);
        // Set status to "running"
        run.status = "running";
        fetch("http://localhost:8081/run/" + run._id, {
            method: "PUT",
            body: JSON.stringify(run),
            headers: {
                "Content-Type": "application/json"
            }
        });
        // Run test
        var result = await runner.run(run.test);
        // Process and save results
        run.status = "complete";
        run.steps = result;
        fetch("http://localhost:8081/run/" + run._id, {
            method: "PUT",
            body: JSON.stringify(run),
            headers: {
                "Content-Type": "application/json"
            }
        });
    },
    checkNewRun: function() {
        fetch("http://localhost:8081/run_first")
            .then(function(response) {
                return response.text();
            })
            .then(async function(run) {
                // Process runs
                if (run.length > 0) {
                    // Execute
                    await loop.newRun(JSON.parse(run));
                }
                // Wait for next run
                loop.checkNewRunTimeout();
            })
            .catch(function(error) {
                console.log(error.toString());
            });
    },
    checkNewRunTimeout: function() {
        setTimeout(function() { loop.checkNewRun(); }, 5000);
    }
}

loop.checkNewRun();