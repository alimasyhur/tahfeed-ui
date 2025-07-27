<template>
  <v-app class="tahfeed-app">
    <div class="app-wrapper">
      <!-- Header - Always visible -->
      <AppHeader />

      <!-- Sidebar - Only on desktop -->
      <Sidebar :drawer="drawer" :rail="rail" @update:drawer="drawer = $event" @update:rail="appStorage.setRail" />

      <!-- Main Content Area -->
      <v-main class="main-content" :class="{
        'mobile-main': $vuetify.display.smAndDown,
        'desktop-main': $vuetify.display.mdAndUp
      }">
        <div class="content-wrapper">
          <router-view />
        </div>
      </v-main>

      <!-- Footer -->
      <AppFooter />
    </div>
  </v-app>
</template>

<script>
import { RouterView } from "vue-router"
import AppHeader from "./components/layouts/AppHeader.vue"
import Sidebar from "./components/layouts/AppDrawerList.vue"
import AppFooter from "./components/layouts/AppFooter.vue"
import { ref } from "vue";
import { useAppStorage } from '@/stores/appStorage'
import { storeToRefs } from 'pinia'

export default {
  components: {
    RouterView,
    AppHeader,
    Sidebar,
    AppFooter,
  },
  setup() {
    const appStorage = useAppStorage()
    const { rail } = storeToRefs(appStorage)
    const drawer = ref(true)

    return {
      drawer,
      rail,
      appStorage,
    }
  },
}
</script>

<style scoped>
/* Reset any default margins/padding */
.tahfeed-app {
  margin: 0 !important;
  padding: 0 !important;
}

.app-wrapper {
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main content styling */
.main-content {
  flex: 1;
  background: #f8f9fa;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-wrapper {
  width: 100%;
  min-height: calc(100vh - 120px);
  /* Account for header and footer */
}

/* Mobile-specific styling */
.mobile-main {
  margin-left: 0 !important;
  padding-left: 0 !important;
  padding-bottom: 80px;
  /* Space for bottom navigation */
  --v-layout-left: 0px !important;
}

/* Desktop-specific styling */
.desktop-main {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Global mobile responsive fixes */
@media (max-width: 959px) {
  .main-content {
    margin-left: 0 !important;
    padding-left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .content-wrapper {
    padding-left: 0 !important;
    margin-left: 0 !important;
    width: 100% !important;
  }

  /* Override any Vuetify layout calculations */
  .v-main {
    --v-layout-left: 0px !important;
    --v-layout-right: 0px !important;
  }

  .v-main>.v-main__wrap {
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
}

/* Desktop layout adjustments */
@media (min-width: 960px) {
  .main-content {
    padding-bottom: 0;
  }
}

/* Smooth animations for layout transitions */
.v-main {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Ensure proper stacking context */
.app-wrapper {
  position: relative;
  z-index: 1;
}
</style>

<style>
/* Global styles to fix mobile layout issues */
@media (max-width: 959px) {

  /* Force full width on mobile */
  .v-application {
    margin: 0 !important;
    padding: 0 !important;
  }

  .v-application__wrap {
    margin: 0 !important;
    padding: 0 !important;
  }

  .v-main {
    margin-left: 0 !important;
    padding-left: 0 !important;
    --v-layout-left: 0px !important;
  }

  .v-main__wrap {
    margin-left: 0 !important;
    padding-left: 0 !important;
  }

  /* Hide navigation drawer completely on mobile */
  .v-navigation-drawer {
    display: none !important;
  }

  /* Ensure containers take full width */
  .v-container {
    max-width: 100% !important;
    padding-left: 16px !important;
    padding-right: 16px !important;
  }

  .v-container.fluid {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

/* Smooth transitions for all layout changes */
.v-main,
.v-main__wrap {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
</style>