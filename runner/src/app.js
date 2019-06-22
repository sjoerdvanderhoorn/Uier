const settings = require('../../settings');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const runner = require("./runner.js");

console.log(settings.shared.runner_secret)

var loop = {
    newRun: async function (run) {
        console.log("Running", run.uid);
        // Set status to "running"
        run.status = "running";
        run.start = new Date();
        fetch("http://localhost:8081/run/" + run.uid, {
            method: "PATCH",
            body: JSON.stringify({
                status: run.status,
                start: run.date
            }),
            headers: {
                "x-runner": bcrypt.hashSync(settings.shared.runner_secret, 10),
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
                "x-runner": bcrypt.hashSync(settings.shared.runner_secret, 10),
                "Content-Type": "application/json"
            }
        });
    },
    checkNewRun: function () {
        fetch("http://localhost:8081/run/next", {
            headers:
            {
                "x-runner": bcrypt.hashSync(settings.shared.runner_secret, 10)
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(async function (run) {
                // Process runs
                if (run.uid) {
                    // Execute
                    await loop.newRun(run);
                }
            })
            .catch(function (error) {
                console.log(error.toString());
            });
        // Wait for next run
        loop.checkNewRunTimeout();
    },
    checkNewRunTimeout: function () {
        setTimeout(function () { loop.checkNewRun(); }, 5000);
    }
}

loop.checkNewRun();