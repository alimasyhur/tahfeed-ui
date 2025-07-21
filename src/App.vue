<template>
  <v-app ref="app" class="rounded rounded-md">
    <AppHeader />
    <v-main class="bg-grey-lighten-4">
      <Sidebar :drawer="drawer" :rail="rail" @update:drawer="drawer = $event" @update:rail="appStorage.setRail" />
      <RouterView />
    </v-main>
    <AppFooter />
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
