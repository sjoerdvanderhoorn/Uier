<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Collections</h1>
        <p class="lead">Use collections to run multiple tests at a time.</p>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

<!-- Mockup -->
      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th style="width: 200px;">Collection</th>
            <th>Tests</th>
            <th>URL Domains</th>
            <th>Browsers</th>
            <th>Last run</th>
            <th>Last result</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td nowrap>
                Production
              </td>
              <td>7</td>
              <td nowrap>https://www.tweakers.net/<br/>https://www.tweakers.com/</td>
              <td>Chrome, Edge, Firefox</td>
              <td>2019-06-01T11:26:57.441Z</td>
              <td>
                <span class="badge badge-pill badge-success">5 pass</span>
                <span class="badge badge-pill badge-danger">2 fail</span>
              </td>
              <td>
                <button class="btn btn-danger" title="Remove">x</button>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <ul class="list-group">
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                </ul>
              </td>
            </tr>
            <tr>
              <td nowrap>
                Smoketest
              </td>
              <td>7</td>
              <td nowrap>https://www.tweakers.net/<br/>https://www.tweakers.com/</td>
              <td>Chrome, Edge, Firefox</td>
              <td>2019-06-01T11:26:57.441Z</td>
              <td>
                <span class="badge badge-pill badge-success">5 pass</span>
                <span class="badge badge-pill badge-danger">2 fail</span>
              </td>
              <td>
                <button class="btn btn-danger" title="Remove">x</button>
              </td>
            </tr>
            <tr>
              <td colspan="6">
                <ul class="list-group">
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                  <li class="list-group-item">Enter search string on Google <span class="badge badge-pill badge-success">pass</span></li>
                  <li class="list-group-item">Look at Google Maps <span class="badge badge-pill badge-danger">fail</span></li>
                </ul>
              </td>
            </tr>
        </tbody>
      </table>
<!-- /Mockup -->

      <div v-if="loading && runs.length == 0" class="alert alert-primary">Loading...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Collections",
  data() {
    return {
      loading: false,
      runs: [],
      error: null,
      timer: null
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
