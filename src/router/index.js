import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home/HomePage.vue'

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
    component: () => import(/* webpackChunkName: "SignupPage" */ '../views/Signup/SignupPage.vue')
  },
  {
    path: '/roomspage',
    name: 'RoomsPage',
    component: () => import(/* webpackChunkName: "RoomsPage" */ '../views/Rooms/RoomsPage.vue')
  },
  {
    path: '/roomsmanagement',
    name: 'RoomsManagement',
    component: () => import(/* webpackChunkName: "RoomsManagement" */ '../views/Rooms/RoomsManagement.vue')
  },
  {
    path: '/roomstaffassign',
    name: 'RoomStaffAssign',
    component: () => import(/* webpackChunkName: "RoomsManagement" */ '../views/Rooms/RoomStaffAssign.vue')
  },
  {
    path: '/cafeteriapage',
    name: 'CafeteriaPage',
    component: () => import(/* webpackChunkName: "CafeteriaPage" */ '../views/Cafeteria/CafeteriaPage.vue')
  },
  {
    path: '/cafeteriamanagement',
    name: 'CafeteriaManagement',
    component: () => import(/* webpackChunkName: "CafeteriaManagement" */ '../views/Cafeteria/CafeteriaManagement.vue')
  },
  {
    path: '/cafeteriastaffassign',
    name: 'CafeteriaStaffAssign',
    component: () => import(/* webpackChunkName: "CafeteriaManagement" */ '../views/Cafeteria/CafeteriaStaffAssign.vue')
  },
  {
    path: '/employeemanagement',
    name: 'EmployeeManagement',
    component: () => import(/* webpackChunkName: "EmployeeManagement" */ '../views/Employee/EmployeeManagement.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
