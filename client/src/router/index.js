import Vue from "vue"
import Router from "vue-router"
// Pages
import Dashboard from "@/components/Dashboard"
import About from "@/components/About"
import Help from "@/components/Help"
import Tests from "@/components/Tests"
import Test from "@/components/Test"
import Runs from "@/components/Runs"
import Run from "@/components/Run"
import Collections from "@/components/Collections"
import Collection from "@/components/Collection"

Vue.use(Router)

const PageNotFound = { template: "<div>Page not found</div>" }

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "Dashboard",
            component: Dashboard
        },
        {
            path: "/tests",
            name: "Tests",
            component: Tests
        },
        {
            path: "/test/:id",
            name: "Test",
            component: Test
        },
        {
            path: "/runs",
            name: "Runs",
            component: Runs
        },
        {
            path: "/run/:id",
            name: "Run",
            component: Run
        },
        {
            path: "/collections",
            name: "Collections",
            component: Collections
        },
        {
            path: "/collection/:id",
            name: "Collection",
            component: Collection
        },
        {
            path: "/about",
            name: "About",
            component: About
        },
        {
            path: "/help",
            name: "Help",
            component: Help
        },
        {
            path: "*",
            name: "NotFound",
            component: PageNotFound
        }
    ]
})