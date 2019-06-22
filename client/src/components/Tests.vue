<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Tests</h1>
        <p class="lead">Overview of all tests in the system with details on their last few runs.</p>
        <hr class="my-4">
        <p></p>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#addTest"
          v-if="$root.$data.roles.includes('test_add')"
        >Add Test</button>
        <button class="btn btn-secondary" v-if="$root.$data.roles.includes('test_run')">Run all tests</button>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th>Test</th>
            <th style="width: 150px;">Steps</th>
            <th style="width: 150px;">Last Run</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="test in tests">
            <tr v-bind:key="test.uid">
              <td>
                <router-link :to="'/test/' + test.uid">{{ test.name }}</router-link>
                <br>
                <span class="text-muted">{{test.purpose}}</span>
              </td>
              <td>{{test.stepCount}}</td>
              <td>pass/fail?</td>
              <td>
                <button class="btn btn-danger" title="Remove" v-on:click="removeTest(test.uid)" v-if="$root.$data.roles.includes('test_delete')">x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="loading" class="alert alert-primary">Loading...</div>
    </div>

    <!-- Add Test -->
    <div
      class="modal fade"
      id="addTest"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addTestLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addTestLabel">Add Test</h5>
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
                <input type="text" class="form-control" v-model="addTestTemplate.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Purpose of test</span>
                </div>
                <textarea class="form-control" v-model="addTestTemplate.purpose"></textarea>
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Browser</span>
                </div>
                <select class="form-control" v-model="addTestTemplate.browser">
                  <option
                    v-for="(browser, browsername) in browsers"
                    v-bind:key="browsername"
                    v-bind:value="browsername"
                    v-bind:selected="browsername==addTestTemplate.browser"
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
                  v-model="addTestTemplate.urlDomain"
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
                  v-model="addTestTemplate.urlPath"
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              v-on:click="addTest()"
            >Create Test</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tests",
  data() {
    return {
      loading: false,
      tests: null,
      error: null,
      // Browsers
      browsers: require("../../../runner/src/browsers.js"),
      addTestTemplate: {
        name: "",
        purpose: "",
        browser: "",
        urlDomain: "",
        urlPath: ""
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
      this.error = this.tests = null;
      this.loading = true;
      this.$parent.request("http://localhost:8081/test")
        .then(function(response) {
          parent.loading = false;
          if (response.status == 401) {
            location.reload();
          }
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
    addTest() {
      var parent = this;
      var data = {
        name: this.addTestTemplate.name,
        purpose: this.addTestTemplate.purpose,
        browser: this.addTestTemplate.browser,
        urlDomain: this.addTestTemplate.urlDomain,
        urlPath: this.addTestTemplate.urlPath
      };
      this.$parent.request("http://localhost:8081/test", {
        method: "POST",
        body: JSON.stringify(data),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          parent.$router.push("/test/" + json.uid);
        });
    },
    removeTest: function(testId) {
      if (window.confirm("Are you sure you want to remove this test?")) {
        var parent = this;
        this.$parent.request("http://localhost:8081/test/" + testId, {
          method: "DELETE",
          headers: new Headers({
            "Content-Type": "application/json"
          })
        }).then(function(response) {
          parent.fetchData();
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
