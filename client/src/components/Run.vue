<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{test.name}}</h1>
      <p class="lead">{{test.purpose}}</p>
      <hr class="my-4">
    </div>

    <div class="row">
      <!-- Steps -->
      <div class="col-sm-8">
        <table class="table table-hover">
          <tbody>
            <template v-for="(step, stepNumber) in test.steps">
              <tr
                v-bind:key="stepNumber+'_list'"
                v-bind:class="{ 'table-active': stepNumber==activeStep }"
                v-on:click="(activeStep!=stepNumber?activeStep=stepNumber:activeStep=-1)"
              >
                <td width="50" class="text-muted text-right">#{{stepNumber}}</td>
                <td style="min-width: 10px;" nowrap>
                  <div
                    class="testui-indention"
                    v-for="depth in stepDepth(stepNumber)"
                    v-bind:key="depth"
                  >&nbsp;</div>
                </td>
                <td>
                  <span
                    class="badge badge-warning float-right"
                    v-if="tests[0].step==stepNumber"
                  >{{tests[0].error}}</span>
                  {{step.name}}
                  <br>
                  <span class="text-muted">{{commandDescription(stepNumber)}}</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Output/Actions -->
      <div class="col-sm-4">
        <div class="card" id="testui-actions">
          <img
            :src="'data:image/png;base64,' + (activeStep > -1 ? test.steps[activeStep].screenshot : '')"
            class="card-img-top"
            alt="..."
          >
          <div class="card-body">
            <h5 class="card-title">Step #{{activeStep}}</h5>
            <p class="card-text">{{(activeStep > -1 ? test.steps[activeStep].name : '')}}</p>
            <a href="#" class="btn btn-primary">Reveal HTML</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Run",
  data() {
    return {
      // TestUI system
      activeStep: -1,
      movingRow: null,
      // Commands
      commands: require("../../../runner/src/commands.js"),
      // Last test results
      tests: [
        {
          date: "2019-05-21 12:00:00",
          result: "fail",
          step: 3,
          error: "Error during last run"
        }
      ],
      // User data
      test: {
        name: "",
        purpose: "",
        url: "",
        steps: []
      }
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      var parent = this;
      this.error = null;
      this.loading = true;
      fetch("http://localhost:8081/run/" + this.$route.params.id)
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(myjson) {
          // Load data
          parent.test.name = myjson.name;
          parent.test.purpose = myjson.purpose;
          parent.test.url = myjson.url;
          parent.test.steps = myjson.steps;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    saveData() {
      var parent = this;
      var data = {
        name: this.test.name,
        purpose: this.test.purpose,
        url: this.test.url,
        steps: this.test.steps
      };
      fetch("http://localhost:8081/test/" + this.$route.params.id, {
        credentials: "same-origin",
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }).then(function(response) {
        parent.$router.push("/tests");
      });
    },
    runTest() {
      var parent = this;
      var data = {
        test: this.$route.params.id,
        status: "new"
      };
      fetch("http://localhost:8081/run", {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }).then(function(response) {
        parent.$router.push("/runs");
      });
    },
    stepDepth: function(stepNumber) {
      var depth = 0;
      this.test.steps
        .slice(0, stepNumber + 1)
        .forEach(function(step, i, tempSteps) {
          tempSteps.push({ command: "bogus" });
          var lastStep = tempSteps[i - 1];
          if (i > 0 && lastStep.command == "if") {
            depth++;
          } else if (i > 0 && step.command == "else") {
            depth--;
          } else if (i > 0 && lastStep.command == "else") {
            depth++;
          } else if (i > 0 && step.command == "end") {
            depth--;
          }
        });
      return depth;
    },
    commandDescription: function(stepNumber) {
      var step = this.test.steps[stepNumber];
      return this.commands[step.command].friendly
        .replace("{target}", step.target ? step.target : "(...)")
        .replace("{value}", '"' + (step.value ? step.value : "(...)") + '"')
        .replace("{expression}", step.expression ? step.expression : "(...)");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Steps listing */
li.testui-step {
  cursor: pointer;
}

li.testui-step:not(.active):hover {
  background-color: #f3f7fb;
}

.testui-rownumber {
  display: inline-block;
  width: 25px;
}

/* Step indention */
.testui-indention {
  width: 10px;
  height: 100%;
  margin-left: 3px;
  margin-right: 3px;
  display: inline-block;
}
.testui-indention:nth-of-type(odd) {
  background-color: red;
}
.testui-indention:nth-of-type(even) {
  background-color: blue;
}
#testui-actions {
  position: sticky;
  top: 60px;
}
</style>
