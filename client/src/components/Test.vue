<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{test.name}}</h1>
      <p class="lead">{{test.purpose}}</p>
      <hr class="my-4">
      <p>Browser: {{(browsers[test.browser] ? browsers[test.browser].name : "")}}</p>
      <p>URL: <a :href="test.urlDomain + test.urlPath" target="_blank" title="Open Default URL in new browser window.">{{test.urlDomain}}{{test.urlPath}}</a></p>

      <button class="btn btn-primary" v-on:click="saveData();">Save Changes</button>
      <button class="btn btn-secondary" v-on:click="runTest();">Run test</button>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-secondary"
        data-toggle="modal"
        data-target="#editDetails"
      >Edit Details</button>
    </div>

    <!-- Edit Test Details -->
    <div
      class="modal fade"
      id="editDetails"
      tabindex="-1"
      role="dialog"
      aria-labelledby="editDetailsLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editDetailsLabel">Test Details</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Name</span>
                </div>
                <input type="text" class="form-control" v-model="test.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Purpose of test</span>
                </div>
                <textarea class="form-control" v-model="test.purpose"></textarea>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Browser</span>
                </div>
                <select class="form-control" v-model="test.browser">
                    <option
                      v-for="(browser, browsername) in browsers"
                      v-bind:key="browsername"
                      v-bind:value="browsername"
                      v-bind:selected="browsername==test.browser"
                    >{{browser.name}}</option>
                  </select>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">URL Domain</span>
                </div>
                <input type="text" class="form-control" placeholder="https://www.mydomain.com/" v-model="test.urlDomain">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">URL Path</span>
                </div>
                <input type="text" class="form-control" placeholder="/folder/index.php" v-model="test.urlPath">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
          </div>
        </div>
      </div>
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
                <td width="50" class="text-muted text-right">#{{stepNumber + 1}}</td>
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
                    v-if="runs[0].step==stepNumber"
                  >{{runs[0].error}}</span>
                  {{step.name}}
                  <br>
                  <span class="text-muted">{{commandDescription(stepNumber)}}</span>
                </td>
                <td width="100" nowrap>
                  <button
                    class="btn btn-info"
                    v-bind:class="{'btn-info': movingRow==null || movingRow==stepNumber, 'btn-warning': movingRow!=null && movingRow!=stepNumber}"
                    :title="movingRow==null ? 'Move' : 'Move to this position'"
                    v-on:click="moveStep(stepNumber)"
                  >=</button>
                  <button
                    class="btn btn-danger"
                    title="Remove"
                    v-on:click="removeStep(stepNumber)"
                  >x</button>
                </td>
              </tr>
              <tr
                v-bind:key="stepNumber+'_detail'"
                v-if="stepNumber==activeStep && movingRow==null"
              >
                <td colspan="4">
                  <div class="container">
                    <div class="row">
                      <!-- Name -->
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" style="width: 8em;">Name</span>
                        </div>
                        <input type="text" class="form-control" v-model="step.name">
                      </div>

                      <!-- Command -->
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <button
                            class="btn dropdown-toggle"
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            style="width: 8em; background-color: #e9ecef; border-color: #ced4da; color: #495057; text-align: left;"
                          >{{commands[step.command].name}}</button>
                          <div class="dropdown-menu" style="max-height: 300px; overflow-y: scroll;">
                            <div class="dropdown-header">Command</div>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-for="(command, commandname) in commands"
                              v-bind:key="commandname"
                              v-on:click="step.command=commandname"
                              v-bind:class="{active: step.command==commandname}"
                            >{{command.name}}</a>
                          </div>
                        </div>
                        <!-- Controls -->
                        <div
                          class="input-group-prepend dropright"
                          v-if="commands[step.command].fields.includes('target')"
                        >
                          <button
                            type="button"
                            class="btn dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            style="background-color: white; border-right: none; border-color: #ced4da; color: #ced4da;"
                          >{{step.target.type}}&nbsp;</button>
                          <div class="dropdown-menu">
                            <a
                              class="dropdown-item"
                              v-on:click="step.target.type='css'"
                            >CSS selector</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a class="dropdown-item" v-on:click="step.target.type='id'">ID tag</a>
                            <a class="dropdown-item" v-on:click="step.target.type='name'">Name tag</a>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target.type='className'"
                            >Class Name</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target.type='js'"
                            >Javascript expression</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target.type='linkText'"
                            >Link Text</a>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target.type='partialLinkText'"
                            >Partial Link Text</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a class="dropdown-item" v-on:click="step.target.type='xpath'">xpath</a>
                          </div>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          v-model="step.target.query"
                          v-if="commands[step.command].fields.includes('target')"
                          placeholder="Target"
                        >
                        <input
                          type="text"
                          class="form-control"
                          v-model="step.value"
                          v-if="commands[step.command].fields.includes('value')"
                          placeholder="Value"
                        >
                        <textarea
                          class="form-control"
                          v-model="step.code"
                          v-if="commands[step.command].fields.includes('code')"
                          placeholder="test()"
                        ></textarea>
                        <textarea
                          class="form-control"
                          v-model="step.expression"
                          v-if="commands[step.command].fields.includes('expression')"
                          placeholder="abc=123"
                        ></textarea>
                        <!-- Info -->
                        <div class="input-group-append">
                          <span class="input-group-text">
                            <a
                              href="#"
                              class="badge badge-pill badge-info"
                              v-bind:title="commands[step.command].info"
                            >?</a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="mb-3">
          <button class="btn btn-light float-right" v-on:click="addStep()">+ Add Step</button>
        </div>
      </div>

      <!-- Output/Actions -->
      <div class="col-sm-4">
        <div class="card" id="testui-actions">
          <img
            src="https://media.wired.com/photos/5b3baf1ece9419115f46bb15/master/w_440,c_limit/mac_screenshot-02.jpg"
            class="card-img-top"
            alt="..."
          >
          <div class="card-body">
            <h5 class="card-title">Actions</h5>
            <p
              class="card-text"
            >Screenshot information and other details about last run, plus a "Run up to here" button?</p>
            <a href="#" class="btn btn-primary">Run up to here</a>
            <a href="#" class="btn btn-secondary">Reveal HTML</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      // TestUI system
      activeStep: -1,
      movingRow: null,
      // Browsers
      browsers: require("../../../runner/src/browsers.js"),
      // Commands
      commands: require("../../../runner/src/commands.js"),
      // Last test results
      runs: [
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
        browser: "",
        urlDomain: "",
        urlPath: "",
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
      fetch("http://localhost:8081/test/" + this.$route.params.id)
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.test.name = json.name;
          parent.test.purpose = json.purpose;
          parent.test.browser = json.browser;
          parent.test.urlDomain = json.urlDomain;
          parent.test.urlPath = json.urlPath;
          parent.test.steps = json.steps;
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
        browser: this.test.browser,
        urlDomain: this.test.urlDomain,
        urlPath: this.test.urlPath,
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
        status: "new",
        browser: this.test.browser,
        urlDomain: this.test.urlDomain // Only store URL Domain, URL Path is taken from the test
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
        .replace("{target}", step.target ? step.target.query : "(...)")
        .replace("{value}", '"' + (step.value ? step.value : "(...)") + '"')
        .replace("{expression}", step.expression ? step.expression : "(...)");
    },
    addStep: function() {
      this.test.steps.push({
        name: "",
        command: "click",
        target: { query: "", type: "css" }
      });
      this.activeStep = this.test.steps.length - 1;
    },
    removeStep: function(stepNumber) {
      this.test.steps.splice(stepNumber, 1);
      this.activeStep = -1;
    },
    moveStep: function(stepNumber) {
      if (this.movingRow == null) {
        this.movingRow = stepNumber;
      } else {
        // alert("Move " + $scope.movingRow + " to " + index);
        this.test.steps.splice(
          stepNumber,
          0,
          this.test.steps.splice(this.movingRow, 1)[0]
        );
        this.movingRow = null;
      }
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
