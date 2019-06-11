<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Runs</h1>
        <p class="lead">Overview of all runs.</p>
            <hr class="my-4">
        <p></p>
        <button class="btn btn-secondary">Cancel all runs</button>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th style="width: 200px;">Run</th>
            <th>Test</th>
            <th>Environment</th>
            <th style="width: 150px;">Duration</th>
            <th style="width: 150px;">Status</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="run in runs">
            <tr v-bind:key="run._id">
              <td nowrap>
                <router-link :to="'/run/' + run._id">{{run.created.replace("T", " ").substr(0,19)}}</router-link>
              </td>
              <td>
                {{run.test.name}}<br/>
                <span class="text-muted">{{run.test.purpose}}</span>
              </td>
              <td>
                {{browsers[run.browser].name}}<br/>
                <span class="text-muted">{{run.urlDomain}}</span>
              </td>
              <td>
                <span
                  v-if="run.end"
                >{{((new Date(run.end)).getTime() - (new Date(run.start)).getTime()) / 1000}} seconds</span>
                <span v-if="!run.end">-</span>
              </td>
              <td>
                <span
                  class="badge badge-pill"
                  v-bind:class="{'badge-success':run.status=='pass', 'badge-danger':run.status=='fail', 'badge-primary': run.status!='pass' && run.status != 'fail'}"
                >{{run.status}}</span>
              </td>
              <td>
                <button class="btn btn-danger" title="Remove" v-on:click="removeRun(run._id)">x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="loading && runs.length == 0" class="alert alert-primary">Loading...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Runs",
  data() {
    return {
      loading: false,
      runs: [],
      error: null,
      timer: null,
      // Browsers
      browsers: require("../../../runner/src/browsers.js")
    };
  },
  created() {
    var parent = this;
    this.fetchData();
    // Update status every 10 seconds
    this.timer = setInterval(function() {
      parent.fetchData();
    }, 2 * 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      var parent = this;
      // this.error = this.runs = null;
      this.loading = true;
      fetch("http://localhost:8081/run")
        .then(function(response) {
          parent.loading = false;
          parent.error = null;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.runs = json;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    removeRun: function(runId) {
      if (window.confirm("Are you sure you want to remove this run?")) {
        var parent = this;
        fetch("http://localhost:8081/run/" + runId, {
          credentials: "same-origin",
          method: "DELETE",
          body: "",
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
