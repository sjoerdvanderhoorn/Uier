<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{test.name}}</h1>
      <p class="lead">{{test.purpose}}</p>
      <hr class="my-4">
      <p>Browser: {{(browsers[test.browser] ? browsers[test.browser].name : "")}}</p>
      <p>
        URL:
        <a
          :href="test.urlDomain + test.urlPath"
          target="_blank"
          title="Open Default URL in new browser window."
        >{{test.urlDomain}}{{test.urlPath}}</a>
      </p>

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
                <input
                  type="text"
                  class="form-control"
                  placeholder="https://www.mydomain.com/"
                  v-model="test.urlDomain"
                >
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">URL Path</span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  placeholder="/folder/index.php"
                  v-model="test.urlPath"
                >
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
                  <span class="text-muted" v-html="commandDescription(stepNumber)"></span>
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
                          >{{step.target_type}}&nbsp;</button>
                          <div class="dropdown-menu">
                            <a
                              class="dropdown-item"
                              v-on:click="step.target_type='css'"
                            >CSS selector</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a class="dropdown-item" v-on:click="step.target_type='id'">ID tag</a>
                            <a class="dropdown-item" v-on:click="step.target_type='name'">Name tag</a>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target_type='className'"
                            >Class Name</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target_type='js'"
                            >Javascript expression</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target_type='linkText'"
                            >Link Text</a>
                            <a
                              class="dropdown-item"
                              v-on:click="step.target_type='partialLinkText'"
                            >Partial Link Text</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a class="dropdown-item" v-on:click="step.target_type='xpath'">xpath</a>
                          </div>
                        </div>
                        <input
                          type="text"
                          class="form-control"
                          v-model="step.target_query"
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
        <div class="card" id="testui-actions" v-if="activeStep > -1">
          <div class="card-body">
            <h5 class="card-title">{{commands[test.steps[activeStep].command].name}}</h5>
            <p class="card-text">{{commands[test.steps[activeStep].command].info}}</p>
            <h6 class="card-title">Name</h6>
            <p class="card-text">
              Your description of what this step is supposed to do. This can be plain English or any other language of choice. Eg:
              <mark>Enter a search string for "milk".</mark>
            </p>
            <template v-if="commands[test.steps[activeStep].command].fields.includes('target')">
              <h6 class="card-title">Target</h6>
              <p class="card-text">
                Provides the reference for the HTML element that the
                <b>{{commands[test.steps[activeStep].command].name}}</b> command should apply to. Change the method using which the element is identified. This can for example be by the elements Name or ID property, using a CSS selector, or using XPath syntax.
              </p>
              <h6 class="card-title" v-if="test.steps[activeStep].target_type=='css'">CSS selector</h6>
              <p class="card-text" v-if="test.steps[activeStep].target_type=='css'">
                In CSS, selectors are patterns used to select the element(s) you want to style. Common examples are
                <mark>#fieldId</mark>,
                <mark>.className</mark>, and
                <mark>htmlElementName</mark>. Also see the w3schools
                <a
                  href="https://www.w3schools.com/cssref/css_selectors.asp"
                  target="_blank"
                >cheatsheet</a> reference.
              </p>
              <h6 class="card-title" v-if="test.steps[activeStep].target_type=='xpath'">XPath</h6>
              <p class="card-text" v-if="test.steps[activeStep].target_type=='xpath'">
                XPath can be used to navigate through elements and attributes in an XML document. Expressions can be made using
                <mark>/rootNode</mark>,
                <mark>./currentNode</mark>,
                <mark>../parentNode</mark>, or
                <mark>@attribute</mark>.
                See a more comprehensive
                <a
                  href="https://www.w3schools.com/xml/xpath_syntax.asp"
                  target="_blank"
                >syntax description</a> on w3schools.
              </p>
            </template>
            <template v-if="commands[test.steps[activeStep].command].fields.includes('value')">
              <h6 class="card-title">Value</h6>
              <p class="card-text">
                The value to be used by the
                <b>{{commands[test.steps[activeStep].command].name}}</b> command.
              </p>
            </template>
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
      fetch("http://localhost:8081/test/" + this.$route.params.id, {
        credentials: "include"
      })
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
        credentials: "include",
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
        browser: this.test.browser,
        urlDomain: this.test.urlDomain
      };
      fetch("http://localhost:8081/test/" + this.$route.params.id + "/run", {
        credentials: "include",
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
    addStep: function() {
      this.test.steps.push({
        name: "",
        command: "click",
        target_query: "",
        target_type: "css",
        value: ""
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
