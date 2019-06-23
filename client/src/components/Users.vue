<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Users</h1>
        <p class="lead">User management.</p>
        <hr class="my-4">
        <p></p>
        <!-- Button trigger modal -->
        <button
          type="button"
          class="btn btn-primary"
          data-toggle="modal"
          data-target="#addUser"
          v-if="$root.$data.roles.includes('user_add')"
        >Add User</button>
      </div>

      <div v-if="error" class="alert alert-warning">Error: {{ error }}</div>

      <table class="table table-borderless table-striped">
        <thead>
          <tr>
            <th>User</th>
            <th style="width: 150px;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="user in users">
            <tr v-bind:key="user.uid">
              <td>
                <router-link :to="'/user/' + user.uid">{{ user.email }}</router-link>
                <br>
                <span class="text-muted">{{user.name}}</span>
              </td>
              <td>
                <button
                  class="btn btn-danger"
                  title="Remove"
                  v-on:click="removeUser(user.uid)"
                  v-if="$root.$data.roles.includes('user_delete')"
                >x</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="loading && users.length == 0" class="alert alert-primary">Loading...</div>
    </div>

    <!-- Add User -->
    <div
      class="modal fade"
      id="addUser"
      tabindex="-1"
      role="dialog"
      aria-labelledby="addUserLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addUserLabel">Add User</h5>
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
                <input type="text" class="form-control" v-model="addUserTemplate.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Email</span>
                </div>
                <input type="email" class="form-control" v-model="addUserTemplate.email">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Password</span>
                </div>
                <input type="password" class="form-control" v-model="addUserTemplate.password">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary"
              data-dismiss="modal"
              v-on:click="addUser()"
            >Create User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      loading: false,
      users: [],
      error: null,
      timer: null,
      addUserTemplate: {
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
      this.$parent.request("http://localhost:8081/user")
        .then(function(response) {
          parent.loading = false;
          parent.error = null;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.users = json;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    addUser() {
      var parent = this;
      var data = {
        name: this.addUserTemplate.name,
        email: this.addUserTemplate.email,
        password: this.addUserTemplate.password
      };
      this.$parent.request("http://localhost:8081/user", {
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
          parent.$router.push("/user/" + json.uid);
        });
    },
    removeUser: function(userId) {
      if (window.confirm("Are you sure you want to remove this user?")) {
        var parent = this;
        this.$parent.request("http://localhost:8081/user/" + userId, {
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
