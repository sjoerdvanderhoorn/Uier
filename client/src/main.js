// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// Import bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'

Vue.config.productionTip = false

// var isAuthenticated = false;

var data = {
    // Store client side properties
    isAuthenticated: false,
    user: {},
    roles: {},
    login: function () {
        data.isAuthenticated = true;
    }
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    data: data,
    template: "<App/>"
})
