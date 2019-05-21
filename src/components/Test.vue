<template>
  <div>
    <div class="jumbotron">
      <h1 class="display-4">{{$route.params.id}} {{name}}</h1>
      <p class="lead">{{purpose}}</p>
      <hr class="my-4">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ex velit, tempus id condimentum sed, pellentesque id orci.</p>
      <a class="btn btn-primary btn-lg" href="#" role="button">Run test</a>
    </div>

    <!-- Test Settings -->
    <div class="form-group">
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 8em;">Name</span>
        </div>
        <input type="text" class="form-control" v-model="name">
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 8em;">Purpose of test</span>
        </div>
        <textarea class="form-control" v-model="purpose"></textarea>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" style="width: 8em;">Start URL</span>
        </div>
        <input type="text" class="form-control" v-model="url">
      </div>
    </div>

    <div class="row">
      <!-- Steps -->
      <ul class="list-group col-sm-8">
        <template v-for="(step, stepNumber) in steps">
          <li
            class="list-group-item testui-step"
            v-bind:key="stepNumber+'_list'"
            v-bind:class="{ active: stepNumber==activeStep }"
            v-on:click="(activeStep!=stepNumber?activeStep=stepNumber:activeStep=-1)"
          >
            <span class="text-muted testui-stepnumber">#{{stepNumber}}</span>
            <!-- Indention -->
            <div
              class="testui-indention"
              v-for="depth in stepDepth(stepNumber)"
              v-bind:key="depth"
            >&nbsp;</div>
            <!-- Details -->
            <span>{{step.name}}</span>
            <span class="badge badge-warning" v-if="tests[0].step==stepNumber">{{tests[0].error}}</span>
            <span class="text-muted testui-command">{{step.command.toLowerCase()}}</span>
          </li>
          <li
            class="list-group-item"
            v-bind:key="stepNumber+'_detail'"
            style="background-color: #f3f7fb;"
            v-if="stepNumber==activeStep"
          >
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
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      style="width: 8em;"
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
          </li>
        </template>
      </ul>

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
      commands: {
        click: {
          name: "Click",
          info:
            "Use this to execute a mouse click on the element specified by the target.",
          fields: ["target"]
        },
        input: {
          name: "Input text",
          info:
            "Use this to input the value text into a the field specified by the target.",
          fields: ["target", "value"]
        },
        javascript: {
          name: "Javascript",
          info: "Specify javascript code to execute against page.",
          fields: ["code"]
        },
        if: {
          name: "If",
          info: "",
          fields: ["expression"]
        },
        else: {
          name: "Else",
          info: "",
          fields: []
        },
        end: {
          name: "End",
          info: "",
          fields: []
        }
      },
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
      name: "My First Test",
      purpose:
        "Suspendisse porttitor sit amet elit sit amet condimentum. Nulla facilisi. Ut egestas laoreet leo nec fringilla. Phasellus auctor egestas sodales. Quisque sit amet felis aliquet, scelerisque sem luctus, porttitor purus.",
      url: "https://www.google.com/",
      steps: [
        {
          name: "Step 1 - Click somewhere",
          command: "click",
          target: "#somebutton"
        },
        {
          name: "Step 2 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "Step 3 - Javascript",
          command: "javascript",
          code: "alert(123)"
        },
        {
          name: "Step 4 - If this=1",
          command: "if",
          expression: "element('#sometext')==true"
        },
        {
          name: "Step 4.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "Step 5 - Else",
          command: "else"
        },
        {
          name: "Step 5.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "Step 6 - End",
          command: "end"
        },
        {
          name: "Step 7 - Enter last text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },

        {
          name: "IF",
          command: "if",
          expression: "element('#sometext')==true"
        },
        {
          name: "Step 4.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "IF",
          command: "if",
          expression: "element('#sometext')==true"
        },
        {
          name: "Step 4.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "Step 4.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "ELSE",
          command: "else"
        },
        {
          name: "Step 5.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "END",
          command: "end"
        },
        {
          name: "Step 4.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "ELSE",
          command: "else"
        },
        {
          name: "Step 5.1 - Enter text",
          command: "input",
          target: "#sometextbox",
          value: "some text"
        },
        {
          name: "END",
          command: "end"
        }
      ]
    };
  },
  methods: {
    stepDepth: function(stepNumber) {
      var depth = 0;
      this.steps.slice(0, stepNumber + 1).forEach(function(step, i, tempSteps) {
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

span.testui-stepnumber {
  display: inline-block;
  width: 2.5em;
}

span.testui-command {
  float: right;
  width: 8em;
  text-align: right;
}

/* Step indention */
.testui-indention {
  width: 10px;
  height: 100%;
  margin-left: 10px;
  margin-right: 10px;
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
  top: 10px;
}
</style>
