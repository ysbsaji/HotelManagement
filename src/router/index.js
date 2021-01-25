import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/signuppage',
    name: 'SignupPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "SignupPage" */ '../views/SignupPage.vue')
  },
  {
    path: '/roomspage',
    name: 'RoomsPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "RoomsPage" */ '../views/RoomsPage.vue')
  },
  {
    path: '/roomsmanagement',
    name: 'RoomsManagement',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "RoomsManagement" */ '../views/RoomsManagement.vue')
  },
  {
    path: '/cafeteriapage',
    name: 'CafeteriaPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "CafeteriaPage" */ '../views/CafeteriaPage.vue')
  },
  {
    path: '/cafeteriamanagement',
    name: 'CafeteriaManagement',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "CafeteriaManagement" */ '../views/CafeteriaManagement.vue')
  },
  {
    path: '/customermanagement',
    name: ' CustomerManagement',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "CustomerManagement" */ '../views/CustomerManagement.vue')
  },
  {
    path: '/employeemanagement',
    name: 'EmployeeManagement',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "EmployeeManagement" */ '../views/EmployeeManagement.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
