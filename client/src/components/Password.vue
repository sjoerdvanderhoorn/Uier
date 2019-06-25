<template>
  <div class="post">
    <div class="content">
      <div class="jumbotron">
        <h1 class="display-4">Password</h1>
        <p class="lead">Update your password.</p>
      </div>
      <form @submit.prevent="updatePassword">
        <div class="col-6 form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" style="width: 8em;">Old password</span>
            </div>
            <input type="password" class="form-control" v-model="passwordOld">
          </div>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" style="width: 8em;">New password</span>
            </div>
            <input type="password" class="form-control" v-model="passwordNew">
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            data-dismiss="modal"
          >Save</button>
          <span class="mt-2 text-danger">{{error}}</span>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Password",
  data() {
    return {
      passwordOld: null,
      passwordNew: null,
      error: null
    };
  },
  methods: {
    updatePassword() {
      var parent = this;
      var data = {
        old: this.passwordOld,
        new: this.passwordNew
      };
      this.$parent
        .request("http://localhost:8081/password", {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          if (json.error) {
            parent.error = json.error;
            parent.passwordOld = "";
            parent.passwordNew = "";
          } else {
            parent.error = null;
            parent.passwordOld = "";
            parent.passwordNew = "";
            alert(json.message);
          }
        });
    }
  }
};
</script>

<style scoped>
</style>