import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import RoleView from '@/views/RoleView.vue'
import OrganizationView from '@/views/OrganizationView.vue'
import UserView from '@/views/UserView.vue'
import { useUserStorage } from '@/stores/userStorage'
import ProfileView from '@/views/ProfileView.vue'
import OrganizationDetailView from '@/views/OrganizationDetailView.vue'
import GradeView from '@/views/GradeView.vue'
import TeacherView from '@/views/TeacherView.vue'
import StudentView from '@/views/StudentView.vue'
import KelasView from '@/views/KelasView.vue'
import KelasDetailView from '@/views/KelasDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      breadcrumb: 'Home'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      breadcrumb: 'About'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      breadcrumb: 'Dashboard',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/role',
    name: 'role',
    component: RoleView,
    meta: {
      breadcrumb: 'Role',
      requiresAuth: true,
      requireSuperAdmin: true
    }
  },
  {
    path: '/organization',
    name: 'organization',
    component: OrganizationView,
    meta: {
      breadcrumb: 'Organization',
      requiresAuth: true,
      requireSuperAdmin: true
    }
  },
  {
    path: '/grade',
    name: 'grade',
    component: GradeView,
    meta: {
      breadcrumb: 'Grade',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    meta: {
      breadcrumb: 'User',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      breadcrumb: 'Profile',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/organization/:slug',
    component: OrganizationDetailView,
    meta: {
      breadcrumb: 'Detail'
    }
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: TeacherView,
    meta: {
      breadcrumb: 'Teacher',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView,
    meta: {
      breadcrumb: 'Student',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/kelas',
    name: 'kelas',
    component: KelasView,
    meta: {
      breadcrumb: 'Class',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/kelas/:slug',
    component: KelasDetailView,
    meta: {
      breadcrumb: 'Detail'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from) => {
  const userStorage = await useUserStorage()
  if (to.meta.requiresAuth && userStorage.currentUser == null) {
    return {
      path: '/home'
    }
  }

  if (to.meta.requireSuperAdmin && userStorage.activeRole?.role_name !== 'Super Admin') {
    return {
      path: 'dashboard'
    }
  }
})

export default router
