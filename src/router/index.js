import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RoleView from '@/views/RoleView.vue'
import OrganizationView from '@/views/OrganizationView.vue'
import UserView from '@/views/UserView.vue'
import { useUserStorage } from '@/stores/userStorage'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/role',
      name: 'role',
      component: RoleView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/organization',
      name: 'organization',
      component: OrganizationView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user',
      name: 'user',
      component: UserView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(async (to, from) => {
  const userStorage = await useUserStorage()
  if (to.meta.requiresAuth && userStorage.currentUser == null) {
    return {
      path: '/home'
    }
  }
})

export default router
