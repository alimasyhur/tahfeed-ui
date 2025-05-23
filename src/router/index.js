import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TeamView from '../views/TeamView.vue'
import DonateView from '../views/DonateView.vue'
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
import ReportView from '@/views/ReportView.vue'
import SummaryView from '@/views/SummaryView.vue'
import SummaryDetailView from '@/views/SummaryDetailView.vue'

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
    path: '/team',
    name: 'team',
    component: TeamView,
    meta: {
      breadcrumb: 'Team'
    }
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView,
    meta: {
      breadcrumb: 'Donate'
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
  },
  {
    path: '/report',
    name: 'report',
    component: ReportView,
    meta: {
      breadcrumb: 'Report',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/summary',
    name: 'summary',
    component: SummaryView,
    meta: {
      breadcrumb: 'Summary',
      requiresAuth: true,
      requireSuperAdmin: false
    }
  },
  {
    path: '/summary/:slug',
    component: SummaryDetailView,
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
