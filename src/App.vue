<template>
  <v-app>
    <div class="app-wrapper">
      <AppHeader />
      <v-main class="bg-grey-lighten-4 main-content">
        <Sidebar :key="sidebarKey" :drawer="drawer" :rail="rail" @update:drawer="drawer = $event"
          @update:rail="appStorage.setRail" />
        <router-view />
      </v-main>
      <AppFooter />
    </div>
  </v-app>
</template>

<script>
import { RouterView } from "vue-router"
import AppHeader from "./components/layouts/AppHeader.vue"
import Sidebar from "./components/layouts/AppDrawerList.vue"
import AppFooter from "./components/layouts/AppFooter.vue"
import { ref, provide } from "vue";
import { useAppStorage } from '@/stores/appStorage'
import { useUserStorage } from '@/stores/userStorage'
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
    const userStorage = useUserStorage()
    const { rail } = storeToRefs(appStorage)
    const drawer = ref(true)

    // Key untuk force reload sidebar
    const sidebarKey = ref(0)

    // Function untuk reload sidebar dengan refresh data
    const reloadSidebar = async () => {
      // console.log('Reloading sidebar with fresh data...')

      try {
        // Refresh user data terlebih dahulu
        await userStorage.dataUser()

        // Tunggu sebentar untuk memastikan data ter-update
        setTimeout(() => {
          // Kemudian reload component
          sidebarKey.value++
          // console.log('Sidebar reloaded with key:', sidebarKey.value)
        }, 100)

      } catch (error) {
        // console.error('Error refreshing data:', error)
        // Tetap reload component meskipun ada error
        sidebarKey.value++
      }
    }

    // Provide function ke seluruh aplikasi
    provide('reloadSidebar', reloadSidebar)

    return {
      drawer,
      rail,
      appStorage,
      sidebarKey
    }
  },
}
</script>