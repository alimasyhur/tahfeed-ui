<template>
  <v-app ref="app" class="rounded rounded-md">
    <AppHeader @dataUpdated="onDataUpdated" />
    <v-main class="bg-grey-lighten-4" style="min-height: 600px;">
      <Sidebar v-model="drawer" :rail="rail" :key="drawerKey" />
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

export default {
  components: {
    RouterView,
    AppHeader,
    Sidebar,
    AppFooter,
  },
  setup() {
    const drawerKey = ref(0);

    const onDataUpdated = (newData) => {
      console.log('wkwk newData: ', newData)
      drawerKey.value += 1;
    };

    const rail = ref(false)
    const drawer = ref(true)

    return {
      drawerKey,
      onDataUpdated,
      rail,
      drawer,
    };
  },
};
</script>