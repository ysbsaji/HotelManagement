import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/Home/HomePage.vue'
import VueCookies from 'vue-cookies'

// Vue.use(VueCookies)
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
    component: () => import('../views/Rooms/index.vue'),
    children: [
      {
        path: '/',
        name: 'RoomStaffAssign',
        component: () => import('../views/Rooms/RoomStaffAssign.vue')
      },
      {
        path: 'rooms',
        name: 'Rooms',
        component: () => import('../views/Rooms/RoomsPage.vue'),
      },
      {
        path: 'roomsmanagement',
        name: 'RoomsManagement',
        component: () => import(/* webpackChunkName: "RoomsManagement" */ '../views/Rooms/RoomsManagement.vue')
      },
      {
        path: 'actions/:name',
        name: 'RoomsActions',
        component: () => import(/* webpackChunkName: "RoomsManagement" */ '../views/Rooms/Action.vue'),
        meta:{
          aboutPage : 'This Page used to manage the rooms'
        }
      },
    ]
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
  {
    path: '/customer',
    name: 'Customer',
    component: () => import(/* webpackChunkName: "EmployeeManagement" */ '../views/Employee/Customer.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.name !== 'SignupPage') {
    if(VueCookies.get('activeUserDetails')) next()
    else !['/roomspage/rooms', '/cafeteriapage', '/'].includes(to.fullPath) ? next({path: '/signuppage'}) : next() 
  }else { next() }
})

export default router
