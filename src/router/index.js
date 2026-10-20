import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import LogoutView from '../views/LogoutView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import GetBookCountView from '../views/GetBookCountView.vue'
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue'
import GetAllBookAPI from '../views/GetAllBookAPI.vue'

import { isAuthenticated, waitForAuth } from '../auth'

import AddBookView from '../views/AddBookView.vue'

const routes = [
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
  {
    path: '/getbookcount',
    name: 'GetBookCount',
    component: GetBookCountView
  },
  {
    path: '/WeatherCheck',
    name: 'GetWeather',
    component: WeatherView
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  await waitForAuth

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: {
        redirect: to.fullPath,
        denied: 'true'
      }
    }
  }

  if (to.name === 'Login' && isAuthenticated.value) {
    return {
      name: 'About'
    }
  }
})

export default router
