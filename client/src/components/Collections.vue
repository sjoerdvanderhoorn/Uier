<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Collections</h1>
        <p class="lead">Use collections to run multiple tests at a time.</p>
        <hr class="my-4">
        <p></p>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#addCollection"
        >Add Collection</button>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th>Collection</th>
            <th style="width: 150px;">Tests</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="collection in collections">
            <tr v-bind:key="collection.uid">
              <td>
                <router-link :to="'/collection/' + collection.uid">{{ collection.name }}</router-link><br/>
              <span class="text-muted">{{collection.description}}</span>
              </td>
              <td>{{collection.testCount}}</td>
              <td>
                <button
                  class="btn btn-danger"
                  title="Remove"
                  v-on:click="removeCollection(collection.uid)"
                >x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="loading && collections.length == 0" class="alert alert-primary">Loading...</div>
    </div>

    <!-- Add Collection -->
    <div
      class="modal fade"
      id="addCollection"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addCollectionLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addCollectionLabel">Add Collection</h5>
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
                <input type="text" class="form-control" v-model="addCollectionTemplate.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Description</span>
                </div>
                <input type="text" class="form-control" v-model="addCollectionTemplate.description">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              v-on:click="addCollection()"
            >Create Collection</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Collections",
  data() {
    return {
      loading: false,
      collections: [],
      error: null,
      timer: null,
      addCollectionTemplate: {
        name: "",
        description: ""
      }
    };
  },
  created() {
    this.fetchData();
  },
  destroyed() {},
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      var parent = this;
      // this.error = this.runs = null;
      this.loading = true;
      fetch("http://localhost:8081/collection")
        .then(function(response) {
          parent.loading = false;
          parent.error = null;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.collections = json;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    addCollection() {
      var parent = this;
      var data = {
        name: this.addCollectionTemplate.name,
        description: this.addCollectionTemplate.description
      };
      fetch("http://localhost:8081/collection", {
        credentials: "same-origin",
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
          parent.$router.push("/collection/" + json.uid);
        });
    },
    removeCollection: function(collectionId) {
      if (window.confirm("Are you sure you want to remove this collection?")) {
        var parent = this;
        fetch("http://localhost:8081/collection/" + collectionId, {
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
