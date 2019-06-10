<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{test.name}}</h1>
      <p class="lead">
        Run: {{run.created.replace("T", " ").substr(0,19)}}
        <span class="badge badge-pill" v-bind:class="{'badge-success':run.status=='pass', 'badge-danger':run.status=='fail', 'badge-primary': run.status!='pass' && run.status != 'fail'}">{{run.status}}</span>
      </p>
      <hr class="my-4">
      <p>Duration: {{((new Date(run.end)).getTime() - (new Date(run.start)).getTime()) / 1000}} seconds</p>
      <button class="btn btn-primary" v-on:click="runTest();">Run again</button>
      <router-link :to="'/test/' + test._id" tag="button" class="btn btn-secondary">Go to test</router-link>
    </div>

    <div class="alert alert-primary" v-if="run.steps.length == 0">Run pending...</div>

    <div class="row" v-if="run.steps.length > 0">
      <!-- Steps -->
      <div class="col-sm-8">
        <table class="table table-hover">
          <tbody>
            <template v-for="(step, stepNumber) in run.steps">
              <tr
                v-bind:key="stepNumber+'_list'"
                v-bind:class="{ 'table-active': stepNumber==activeStep }"
                v-on:click="activeStep=stepNumber"
              >
                <td width="50" class="text-muted text-right">#{{stepNumber + 1}}</td>
                <td width="50">
                  <span v-if="step.error" class="badge badge-danger badge-pill">error</span>
                </td>
                <td>
                  {{step.name}}
                  <br>
                  <span class="text-muted" v-html="commandDescription(stepNumber)"></span>
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
            :src="'data:image/png;base64,' + (run.steps.length > 0 ? run.steps[activeStep].screenshot : '')"
            class="card-img-top"
            alt="..."
          >
          <div class="card-body">
            <h5 class="card-title">Step #{{activeStep + 1}}</h5>
            <p class="card-text">{{(run.steps.length > 0 ? run.steps[activeStep].name : '')}}</p>
            <div v-if="run.steps[activeStep].error" class="alert alert-danger" role="alert">{{run.steps[activeStep].error}}</div>
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
      activeStep: 0,
      // Commands
      commands: require("../../../runner/src/commands.js"),
      // User data
      test: {
        _id: "",
        name: "",
        purpose: "",
        urlPath: ""
      },
      run: {
        created: "",
        status: "",
        browser: "",
        urlDomain: "",
        start: "",
        end: "",
        steps: []
      }
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
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
        .then(function(json) {
          // Load test details
          parent.test._id = json.test._id;
          parent.test.name = json.test.name;
          parent.test.purpose = json.test.purpose;
          parent.test.urlPath = json.test.urlPath;
          // Load run details
          parent.run.created = json.created;
          parent.run.status = json.status;
          parent.run.browser = json.browser;
          parent.run.urlDomain = json.urlDomain;
          parent.run.start = json.start;
          parent.run.end = json.end;
          parent.run.steps = json.steps;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    commandDescription: function(stepNumber) {
      var step = this.run.steps[stepNumber];
      return this.commands[step.command].friendly
        .replace("{target}", "<strong>" + (step.target && step.target.query ? step.target.query : "(...)") + "</strong>")
        .replace("{value}", "<strong>" + (step.value ? step.value : "(...)") + "</strong>")
        .replace("{expression}", "<strong>" + (step.expression ? step.expression : "(...)") + "</strong>");
    },
    runTest() {
      var parent = this;
      var data = {
        browser: this.run.browser,
        urlDomain: this.run.urlDomain
      }
      fetch("http://localhost:8081/test/" + this.test._id + "/run", {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }).then(function(response) {
        parent.$router.push("/runs");
      });
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
