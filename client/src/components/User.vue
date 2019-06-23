<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="error" class="error">Error: {{ error }}</div>

    <div class="jumbotron">
      <h1 class="display-4">{{user.name}}</h1>
      <p class="lead">{{user.email}}</p>
      <hr class="my-4">

      <button
        class="btn btn-primary"
        v-on:click="saveData();"
        v-if="$root.$data.roles.includes('user_update')"
      >Save Changes</button>
      <!-- Button trigger modal -->
      <button
        type="button"
        class="btn btn-secondary"
        data-toggle="modal"
        data-target="#editDetails"
      >Edit Details</button>
    </div>

    <!-- Edit User Details -->
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
            <h5 class="modal-title" id="editDetailsLabel">User Details</h5>
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
                <input type="text" class="form-control" v-model="user.name">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Email</span>
                </div>
                <input type="email" class="form-control" v-model="user.email">
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" style="width: 8em;">Password</span>
                </div>
                <input type="password" class="form-control" v-model="user.password">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Roles -->
      <div class="col-sm-6">
        <ul class="list-group roles" v-for="group in roles" v-bind:key="group.name">
          <li class="list-group-item">
            <strong>{{group.name}}</strong>
          </li>
          <li class="list-group-item" v-for="role in group.roles" v-bind:key="role.role">
            <input type="checkbox" v-model="user.roles" :id="role.code" :value="{role:role.code}">
            <label :for="role.code">
              {{role.name}}
              <br>
              <span class="text-muted">{{role.description}}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      // Roles
      roles: require("../../../server/src/roles.js"),
      // User data
      user: {
        name: "",
        email: "",
        password: null,
        roles: []
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
      this.$parent
        .request("http://localhost:8081/user/" + this.$route.params.id)
        .then(function(response) {
          parent.loading = false;
          return response.json();
        })
        .then(function(json) {
          // Load data
          parent.user.name = json.name;
          parent.user.email = json.email;
          parent.user.password = null;
          parent.user.roles = json.roles;
        })
        .catch(function(error) {
          parent.loading = false;
          parent.error = error.toString();
        });
    },
    saveData() {
      var parent = this;
      var data = {
        name: this.user.name,
        email: this.user.email,
        password: this.user.password,
        roles: this.user.roles
      };
      this.$parent
        .request("http://localhost:8081/user/" + this.$route.params.id, {
          method: "PUT",
          body: JSON.stringify(data),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        })
        .then(function(response) {
          parent.$router.push("/users");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul.roles {
  padding-bottom: 10px;
}
</style>
