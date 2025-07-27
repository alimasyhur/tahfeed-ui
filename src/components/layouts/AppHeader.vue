<template>
  <div>
    <!-- Main App Bar -->
    <v-app-bar color="white" flat elevation="0" height="72" class="header-bar"
      :class="{ 'header-scrolled': isScrolled }">
      <!-- Logo Section -->
      <v-app-bar-title :to="{ name: 'home' }" class="logo-section">
        <div class="logo-container">
          <div class="logo-icon">
            <v-icon icon="mdi-book-open-page-variant" color="green-darken-3" size="28"></v-icon>
          </div>
          <div class="logo-text">
            <span class="text-green-darken-4 font-weight-black">tah</span>
            <span class="text-green-accent-3 font-weight-black">feed</span>
          </div>
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Desktop Navigation -->
      <div class="d-none d-md-flex align-center ga-2" v-if="userStorage.currentUser == null">
        <v-btn :to="{ name: 'home' }" variant="text" class="nav-btn text-none font-weight-medium" rounded="lg">
          <v-icon start icon="mdi-home-outline" size="20"></v-icon>
          Home
        </v-btn>

        <v-btn :to="{ name: 'team' }" variant="text" class="nav-btn text-none font-weight-medium" rounded="lg">
          <v-icon start icon="mdi-account-group-outline" size="20"></v-icon>
          Team
        </v-btn>

        <v-btn :to="{ name: 'donate' }" variant="text" class="nav-btn text-none font-weight-medium" rounded="lg">
          <v-icon start icon="mdi-heart-outline" size="20"></v-icon>
          Donate
        </v-btn>

        <v-btn color="green-darken-2" class="login-btn text-none font-weight-bold mx-4" @click="openLogin()"
          rounded="xl" size="large">
          <v-icon start icon="mdi-login" size="20"></v-icon>
          Login
        </v-btn>
      </div>

      <!-- User Menu (Desktop) -->
      <div class="d-none d-md-flex align-center" v-if="userStorage.currentUser !== null">
        <v-menu v-model="menu" :close-on-content-click="false" location="bottom end" offset="8">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" color="green-darken-2" class="user-menu-btn text-none" rounded="lg"
              size="large">
              <div class="d-flex align-center">
                <v-avatar size="32" color="green-lighten-4" class="me-3">
                  <v-icon icon="mdi-account" color="green-darken-3"></v-icon>
                </v-avatar>
                <div class="text-left">
                  <div class="text-body-2 font-weight-bold text-green-darken-3">
                    {{ activeRole?.org_name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ activeRole?.role_name }}
                  </div>
                </div>
                <v-icon icon="mdi-chevron-down" class="ml-2" size="20"></v-icon>
              </div>
            </v-btn>
          </template>

          <v-card min-width="320" class="rounded-xl" elevation="8">
            <v-card-title class="pb-2">
              <div class="d-flex align-center">
                <v-icon icon="mdi-cog" color="green-darken-2" class="me-2"></v-icon>
                <span class="text-h6">Switch Role</span>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-list class="py-2">
              <v-list-item v-for="(role, idx) in myRoleList" :key="idx" @click="handleSwitchRole(idx)"
                class="rounded-lg mx-2 mb-1" :class="{ 'bg-green-lighten-5': idx === selectedRole }">
                <template v-slot:prepend>
                  <v-avatar size="36" color="green-lighten-4">
                    <v-icon icon="mdi-domain" color="green-darken-2" size="20"></v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-medium">
                  {{ role.org_name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ role.role_name }}
                </v-list-item-subtitle>

                <template v-slot:append v-if="idx === selectedRole">
                  <v-icon icon="mdi-check-circle" color="green" size="20"></v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </div>

      <!-- Mobile Menu Button -->
      <v-btn icon class="d-md-none mobile-menu-btn" @click="mobileDrawer = !mobileDrawer" color="green-darken-2"
        variant="text" size="large">
        <v-icon :icon="mobileDrawer ? 'mdi-close' : 'mdi-menu'" size="24"></v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="mobileDrawer" temporary location="end" width="320" class="mobile-drawer"
      :scrim="true">
      <div class="mobile-drawer-header">
        <div class="d-flex align-center pa-4">
          <div class="logo-container-mobile">
            <v-icon icon="mdi-book-open-page-variant" color="green-darken-3" size="32"></v-icon>
            <div class="ml-3">
              <div class="text-h6 font-weight-bold">
                <span class="text-green-darken-4">tah</span>
                <span class="text-green-accent-3">feed</span>
              </div>
              <div class="text-caption text-grey-darken-1">Platform Tahfidz Modern</div>
            </div>
          </div>
        </div>
        <v-divider></v-divider>
      </div>

      <!-- Mobile Menu Content -->
      <v-list class="py-0">
        <!-- Guest Menu Items -->
        <template v-if="userStorage.currentUser == null">
          <v-list-item :to="{ name: 'home' }" @click="mobileDrawer = false" class="mobile-nav-item">
            <template v-slot:prepend>
              <v-icon icon="mdi-home-outline" color="green-darken-2"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Home</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'team' }" @click="mobileDrawer = false" class="mobile-nav-item">
            <template v-slot:prepend>
              <v-icon icon="mdi-account-group-outline" color="green-darken-2"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Team</v-list-item-title>
          </v-list-item>

          <v-list-item :to="{ name: 'donate' }" @click="mobileDrawer = false" class="mobile-nav-item">
            <template v-slot:prepend>
              <v-icon icon="mdi-heart-outline" color="green-darken-2"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">Donate</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <div class="pa-4">
            <v-btn color="green-darken-2" block size="large" class="text-none font-weight-bold"
              @click="openLogin(); mobileDrawer = false" rounded="xl">
              <v-icon start icon="mdi-login"></v-icon>
              Login
            </v-btn>
          </div>
        </template>

        <!-- Authenticated User Menu -->
        <template v-if="userStorage.currentUser !== null">
          <div class="pa-4">
            <v-card class="rounded-xl bg-green-lighten-5" elevation="0">
              <v-card-text class="pa-4">
                <div class="d-flex align-center">
                  <v-avatar size="48" color="green-lighten-4">
                    <v-icon icon="mdi-account" color="green-darken-3" size="24"></v-icon>
                  </v-avatar>
                  <div class="ml-3">
                    <div class="text-body-1 font-weight-bold text-green-darken-3">
                      {{ activeRole?.org_name }}
                    </div>
                    <div class="text-body-2 text-grey-darken-1">
                      {{ activeRole?.role_name }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <v-divider></v-divider>

          <v-list-subheader class="text-green-darken-3 font-weight-bold">
            <v-icon icon="mdi-cog" class="me-2" size="20"></v-icon>
            Switch Role
          </v-list-subheader>

          <v-list-item v-for="(role, idx) in myRoleList" :key="idx" @click="handleSwitchRole(idx); mobileDrawer = false"
            class="mobile-nav-item" :class="{ 'bg-green-lighten-4': idx === selectedRole }">
            <template v-slot:prepend>
              <v-avatar size="36" color="green-lighten-4">
                <v-icon icon="mdi-domain" color="green-darken-2" size="18"></v-icon>
              </v-avatar>
            </template>

            <v-list-item-title class="font-weight-medium">
              {{ role.org_name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ role.role_name }}
            </v-list-item-subtitle>

            <template v-slot:append v-if="idx === selectedRole">
              <v-icon icon="mdi-check-circle" color="green" size="20"></v-icon>
            </template>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Login Dialog -->
    <v-dialog v-model="dialog" persistent transition="dialog-top-transition" max-width="480">
      <v-card class="login-dialog rounded-xl" elevation="12">
        <v-card-title class="text-h5 font-weight-bold pa-6 text-center">
          <div class="d-flex align-center justify-center">
            <v-icon icon="mdi-login" color="green-darken-2" class="me-2" size="28"></v-icon>
            Login to Tahfeed
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <InputLogin />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import eventBus from "@/stores/eventBus"

import InputLogin from '../forms/InputLogin.vue';

const userStorage = useUserStorage()

const { getMenu, setSelectedRole } = userStorage

const { dialog, selectedRole, activeRole, me } = storeToRefs(userStorage)

// New reactive variables for mobile and scroll
const mobileDrawer = ref(false)
const isScrolled = ref(false)

const openLogin = () => {
  dialog.value = true
}

const menu = ref(false)

const myRoleList = ref({})
const listMenu = ref({})

const handleSwitchRole = (idx) => {
  selectedRole.value = idx
  setSelectedRole(idx)
  const changedRole = myRoleList.value[idx]
  activeRole.value = changedRole
  localStorage.setItem('activeRole', JSON.stringify(changedRole))
  listMenu.value = getMenu(activeRole.value)
  const newData = {
    activeRole: changedRole,
    listMenu: listMenu.value,
    myRoleList
  }

  eventBus.emit('dataSwitchRole', newData)
  menu.value = false // Close desktop menu after selection
};

const updateUserData = (userData) => {
  activeRole.value = userData.activeRole
  myRoleList.value = userData.myRoleList
  listMenu.value = getMenu(userData.activeRole)
};

// Handle scroll effect
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  if (userStorage?.accessToken !== 'null') {
    userStorage.dataUser()
    const myActiveRole = activeRole.value
    const listMenu = getMenu(myActiveRole)
    myRoleList.value = me?.value.roles
    const initData = {
      activeRole: myActiveRole,
      myRoleList: myRoleList.value,
      listMenu
    }

    eventBus.emit('dataSwitchRole', initData);
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

onBeforeMount(() => {
  eventBus.on('dataUpdated', updateUserData);
})

onUnmounted(() => {
  eventBus.off('dataSwitchRole', updateUserData);
  eventBus.off('dataUpdated', updateUserData);
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header-bar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-scrolled {
  background-color: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
}

.logo-section {
  cursor: pointer;
  transition: all 0.2s ease;
}

.logo-section:hover {
  transform: scale(1.02);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-section:hover .logo-icon {
  background: linear-gradient(135deg, #c8e6c9, #dcedc8);
  transform: rotate(5deg);
}

.logo-text {
  font-size: 1.5rem;
  line-height: 1;
}

.nav-btn {
  color: #424242 !important;
  transition: all 0.2s ease;
  margin: 0 4px;
}

.nav-btn:hover {
  background-color: rgba(76, 175, 80, 0.1) !important;
  color: #2e7d32 !important;
  transform: translateY(-1px);
}

.login-btn {
  background: linear-gradient(135deg, #2e7d32, #388e3c) !important;
  color: white !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.user-menu-btn {
  border: 1px solid rgba(46, 125, 50, 0.3);
  transition: all 0.2s ease;
}

.user-menu-btn:hover {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #2e7d32;
  transform: translateY(-1px);
}

.mobile-menu-btn {
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: rotate(90deg);
}

.mobile-drawer {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}

.mobile-drawer-header {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.logo-container-mobile {
  display: flex;
  align-items: center;
}

.mobile-nav-item {
  margin: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.mobile-nav-item:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: translateX(4px);
}

.login-dialog {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
}

/* Animation for mobile drawer */
.v-navigation-drawer--temporary {
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.12);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .logo-text {
    font-size: 1.25rem;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 600px) {
  .header-bar {
    height: 64px !important;
  }

  .logo-container {
    gap: 8px;
  }

  .logo-text {
    font-size: 1.1rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }
}

/* Smooth transitions */
* {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading states */
.v-btn:disabled {
  opacity: 0.6;
}

/* Focus states for accessibility */
.v-btn:focus-visible {
  outline: 2px solid #2e7d32;
  outline-offset: 2px;
}
</style>