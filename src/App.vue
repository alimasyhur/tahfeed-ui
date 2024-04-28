<template>
  <v-app ref="app" class="rounded rounded-md">
    <Header />
    <v-main class="bg-grey-lighten-4" style="min-height: 600px;">
      <Sidebar v-model="drawer" :rail="rail" />
      <RouterView />
    </v-main>
    <Footer />
  </v-app>
</template>

<script setup>
import { RouterView } from "vue-router"
import Header from "./components/layouts/AppHeader.vue"
import Sidebar from "./components/layouts/AppDrawerList.vue"
import Footer from "./components/layouts/AppFooter.vue"
import { ref } from "vue";

const rail = ref(false)
const drawer = ref(true)
</script>