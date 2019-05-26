<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{test.name}}</h1>
      <p class="lead">{{test.purpose}}</p>
      <hr class="my-4">
      <p>Start URL: {{test.url}}</p>

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
                  <span class="input-group-text" style="width: 8em;">Start URL</span>
                </div>
                <input type="text" class="form-control" v-model="test.url">
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
                            <a class="dropdown-item" href="#">Javascript</a>
                            <div role="separator" class="dropdown-divider"></div>
                            <a
                              class="dropdown-item"
                              v-for="(command, commandname) in commands"
                              v-bind:key="commandname"
                              v-on:click="step.command=commandname"
                            >{{command.name}}</a>
                          </div>
                        </div>
                        <!-- Controls -->
                        <input
                          type="text"
                          class="form-control"
                          v-model="step.target"
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

                      <!-- Debug -->
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" style="width: 8em;">Debug</span>
                        </div>
                        <textarea class="form-control">GENERATED CODE</textarea>
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
      },
      // Commands
      commands: {
        click: {
          name: "Click",
          info:
            "Use this to execute a mouse click on the element specified by the target.",
          fields: ["target"],
          friendly: "click on {target}"
        },
        input: {
          name: "Input text",
          info:
            "Use this to input the value text into a the field specified by the target.",
          fields: ["target", "value"],
          friendly: "input {value} on {target}"
        },
        javascript: {
          name: "Javascript",
          info: "Specify javascript code to execute against page.",
          fields: ["code"],
          friendly: "javascript"
        },
        if: {
          name: "If",
          info: "",
          fields: ["expression"],
          friendly: "if {expression}"
        },
        else: {
          name: "Else",
          info: "",
          fields: [],
          friendly: "else"
        },
        end: {
          name: "End",
          info: "",
          fields: [],
          friendly: "end"
        }
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
    },
    addStep: function() {
      this.test.steps.push({ name: "", command: "click" });
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
