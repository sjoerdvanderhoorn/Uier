import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Tests from '@/components/Tests'
import Test from '@/components/Test'
import Runs from '@/components/Runs'
import Run from '@/components/Run'

Vue.use(Router)

export default new Router({
    mode: "history", // Instead of "hash"
    routes: [{
            path: '/',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/tests',
            name: 'Tests',
            component: Tests
        },
        {
            path: '/test/:id',
            name: 'Test',
            component: Test
        },
        {
            path: '/runs',
            name: 'Runs',
            component: Runs
        },
        {
            path: '/run/:id',
            name: 'Run',
            component: Run
        }
    ]
})