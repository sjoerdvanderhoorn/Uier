<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{run.created.replace("T", " ").substr(0,19)}}</h1>
      <hr class="my-4">
      <table class="table table-striped">
        <tbody>
          <tr>
            <td style="width: 7em;">Status</td>
            <td>
              <span
                class="badge badge-pill"
                v-bind:class="{'badge-success':run.status=='pass', 'badge-danger':run.status=='fail', 'badge-primary': run.status!='pass' && run.status != 'fail'}"
              >{{run.status}}</span>
            </td>
          </tr>
          <tr>
            <td>Test</td>
            <td>{{test.name}}</td>
          </tr>
          <tr>
            <td>Domain</td>
            <td>{{run.urlDomain}}</td>
          </tr>
          <tr>
            <td>Browser</td>
            <td>{{(run.browser ? browsers[run.browser].name : '')}}</td>
          </tr>
          <tr>
            <td>Duration</td>
            <td>{{((new Date(run.end)).getTime() - (new Date(run.start)).getTime()) / 1000}} seconds</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-primary" v-on:click="runTest();" v-if="$root.$data.roles.includes('test_run')">Run again</button>
      <router-link :to="'/test/' + test.uid" tag="button" class="btn btn-secondary" v-if="$root.$data.roles.includes('collection_update')">Go to test</router-link>
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
          >
          <div class="card-body">
            <h5 class="card-title">Step #{{activeStep + 1}} of {{run.steps.length}}</h5>
            <p class="card-text">{{(run.steps.length > 0 ? run.steps[activeStep].name : '')}}</p>
            <div
              v-if="run.steps[activeStep].error"
              class="alert alert-danger"
              role="alert"
            >{{run.steps[activeStep].error}}</div>
            <button
              class="btn btn-secondary"
              v-on:click="activeStep--"
              :disabled="activeStep==0"
            >Previous</button>
            <button
              class="btn btn-secondary"
              v-on:click="activeStep++"
              :disabled="activeStep+1 > run.steps.length"
            >Next</button>
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
      // Browsers
      browsers: require("../../../runner/src/browsers.js"),
      // Commands
      commands: require("../../../runner/src/commands.js"),
      // User data
      test: {
        uid: "",
        name: "",
        purpose: ""
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
      this.$parent.request("http://localhost:8081/run/" + this.$route.params.id)
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load test details
          parent.test.uid = json.test;
          parent.test.name = json.test_name;
          parent.test.purpose = json.test_purpose;
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
        .replace(
          "{target}",
          "<strong>" +
            (step.target_query ? step.target_query : "(...)") +
            "</strong>"
        )
        .replace(
          "{value}",
          "<strong>" + (step.value ? step.value : "(...)") + "</strong>"
        )
        .replace(
          "{expression}",
          "<strong>" +
            (step.expression ? step.expression : "(...)") +
            "</strong>"
        );
    },
    runTest() {
      var parent = this;
      var data = {
        browser: this.run.browser,
        urlDomain: this.run.urlDomain
      };
      this.$parent.request("http://localhost:8081/test/" + this.test.uid + "/run", {
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
