import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Tests from '@/components/Tests'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
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
        }
    ]
})