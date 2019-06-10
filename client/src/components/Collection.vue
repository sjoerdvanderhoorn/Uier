<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{collection.name}}</h1>
      <p class="lead">{{collection.description}}</p>
      <hr class="my-4">

      <button class="btn btn-primary" v-on:click="saveData();">Save Changes</button>
      <button class="btn btn-secondary" v-on:click="runCollection();">Run collection</button>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-secondary"
        data-toggle="modal"
        data-target="#editDetails"
      >Edit Details</button>
    </div>

    <!-- Edit Collection Details -->
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
            <h5 class="modal-title" id="editDetailsLabel">Collection Details</h5>
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
                <input type="text" class="form-control" v-model="collection.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Description</span>
                </div>
                <textarea class="form-control" v-model="collection.description"></textarea>
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
      <!-- Tests -->
      <div class="col-sm-12">
        <table class="table table-borderless table-striped">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Test</th>
              <th>Domain</th>
              <th>Browser</th>
              <th>Last Run</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(test, testNumber) in collection.tests">
              <tr v-bind:key="testNumber+'_list'">
                <td width="50" class="text-muted text-right">#{{testNumber + 1}}</td>
                <td>
                  <div class="input-group mb-3">
                    <select class="form-control" v-model="test.test">
                      <option
                        v-for="testDetails in tests"
                        v-bind:key="testDetails._id"
                        v-bind:value="testDetails._id"
                      >{{testDetails.name}}</option>
                    </select>
                    <div class="input-group-append">
                      <router-link
                        :to="'/test/' + test.test"
                        tag="button"
                        class="btn btn-outline-secondary"
                        title="Go to Test."
                      >&#128279;</router-link>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="https://..."
                      v-model="test.urlDomain"
                    >
                    <div class="input-group-append">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        title="Use Domain from test."
                        v-on:click="test.urlDomain=tests.find(t=>t._id==test.test).urlDomain"
                      >&#128203;</button>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="input-group mb-3">
                    <select class="form-control" v-model="test.browser">
                      <option
                        v-for="(browser, browsername) in browsers"
                        v-bind:key="browsername"
                        v-bind:value="browsername"
                        v-bind:selected="browsername==test.browser"
                      >{{browser.name}}</option>
                    </select>
                    <div class="input-group-append">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        title="Use Browser from test."
                        v-on:click="test.browser=tests.find(t=>t._id==test.test).browser;"
                      >&#128203;</button>
                    </div>
                  </div>
                </td>
                <td>
                  <router-link :to="'/run/' + test.run" title="Go to Run.">
                    <span
                      class="badge badge-pill"
                      v-bind:class="{'badge-success':test.status=='pass', 'badge-danger':test.status=='fail', 'badge-primary': test.status!='pass' && test.status != 'fail'}"
                    >{{test.status}}</span>
                  </router-link>
                </td>
                <td width="100" nowrap>
                  <button
                    class="btn btn-info"
                    v-bind:class="{'btn-info': movingRow==null || movingRow==testNumber, 'btn-warning': movingRow!=null && movingRow!=testNumber}"
                    :title="movingRow==null ? 'Move' : 'Move to this position'"
                    v-on:click="moveTest(testNumber)"
                  >=</button>
                  <button
                    class="btn btn-danger"
                    title="Remove"
                    v-on:click="removeTest(testNumber)"
                  >x</button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div class="mb-3">
          <button class="btn btn-light float-right" v-on:click="addTest()">+ Add Test</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Collection",
  data() {
    return {
      // CollectionUI system
      activeTest: -1,
      movingRow: null,
      // Browsers
      browsers: require("../../../runner/src/browsers.js"),
      // Last collection results
      runs: [
        {
          date: "2019-05-21 12:00:00",
          result: "fail",
          test: 3,
          error: "Error during last run"
        }
      ],
      // Tests
      tests: [],
      // User data
      collection: {
        name: "",
        description: "",
        tests: []
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
      fetch("http://localhost:8081/collection/" + this.$route.params.id)
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.collection.name = json.name;
          parent.collection.description = json.description;
          parent.collection.tests = json.tests;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
      fetch("http://localhost:8081/test/")
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.tests = json;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    saveData() {
      var parent = this;
      var data = {
        name: this.collection.name,
        description: this.collection.description,
        tests: this.collection.tests
      };
      fetch("http://localhost:8081/collection/" + this.$route.params.id, {
        credentials: "same-origin",
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }).then(function(response) {
        parent.$router.push("/collections");
      });
    },
    runCollection() {
      var parent = this;
      fetch(
        "http://localhost:8081/collection/" + this.$route.params.id + "/run",
        {
          credentials: "same-origin",
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json"
          })
        }
      ).then(function(response) {
        parent.$router.push("/runs");
      });
    },
    addTest: function() {
      this.collection.tests.push({
        test: "",
        urlDomain: "",
        browser: ""
      });
      this.activeTest = this.collection.tests.length - 1;
    },
    removeTest: function(testNumber) {
      this.collection.tests.splice(testNumber, 1);
      this.activeTest = -1;
    },
    moveTest: function(testNumber) {
      if (this.movingRow == null) {
        this.movingRow = testNumber;
      } else {
        // alert("Move " + $scope.movingRow + " to " + index);
        this.collection.tests.splice(
          testNumber,
          0,
          this.collection.tests.splice(this.movingRow, 1)[0]
        );
        this.movingRow = null;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Tests listing */
li.collectionui-test {
  cursor: pointer;
}

li.collectionui-test:not(.active):hover {
  background-color: #f3f7fb;
}

.collectionui-rownumber {
  display: inline-block;
  width: 25px;
}

/* Test indention */
.collectionui-indention {
  width: 10px;
  height: 100%;
  margin-left: 3px;
  margin-right: 3px;
  display: inline-block;
}
.collectionui-indention:nth-of-type(odd) {
  background-color: red;
}
.collectionui-indention:nth-of-type(even) {
  background-color: blue;
}
#collectionui-actions {
  position: sticky;
  top: 60px;
}
</style>
