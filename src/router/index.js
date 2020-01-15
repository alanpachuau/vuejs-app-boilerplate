import Vue from 'vue'
import VueRouter from 'vue-router'
import {firebase} from '@/plugins/firebase'

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/reset-password',
        name: 'reset_password',
        component: () => import('../views/ResetPassword.vue')
    },
    {
        path: '/',
        component: () => import('../views/Layout/AdminLayout.vue'),
        children: [
            {
                path: '/',
                name: 'home_profile',
                component: () => import(/* webpackChunkName: "profile" */ '../views/Admin/Profile.vue'),
                meta: {
                    title: 'Profile',
                    requiresAuth: true,
                },
            },
            {
                path: 'profile',
                name: 'profile',
                component: () => import(/* webpackChunkName: "profile" */ '../views/Admin/Profile.vue'),
                meta: {
                    title: 'Profile',
                    requiresAuth: true,
                },
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/Admin/Index.vue'),
                meta: {
                    title: 'Dashboard',
                    requiresAuth: true,
                },
            },
            {
                path: 'administrators',
                name: 'administrators',
                component: () => import(/* webpackChunkName: "users" */ '../views/Admin/Administrators.vue'),
                meta: {
                    title: 'Administrators',
                    requiresAuth: true,
                },
            },
            {
                path: 'app-users',
                name: 'app_users',
                component: () => import(/* webpackChunkName: "app_users" */ '../views/Admin/AppUsers.vue'),
                meta: {
                    title: 'App Users',
                    requiresAuth: true,
                },
            },
        ],
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            next()
        } else if (to.matched.some(route => route.meta.requiresAuth)) {
            next({
                name: 'login',
                query: {redirect: to.fullPath}
            })
        } else next()
    })
})

export default router

