<template>
  <v-footer class="bg-teal-darken-4 text-center d-flex flex-column" height="auto"
    style="padding-top: 12px; padding-bottom: 12px;">
    <div>
      <v-btn v-for="{ icon, link } in icons" :key="icon" class="mx-2" :icon="icon" variant="text" target="#"
        :href="link"></v-btn>
    </div>

    <div class="pt-1">
      We dedicated our live for Qur'an
    </div>

    <v-divider class="my-1"></v-divider>

    <div>
      {{ new Date().getFullYear() }} — built with <v-icon icon="mdi-heart" color="red"></v-icon> by
      <strong>tahfeed</strong>
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  {
    icon: "mdi-github",
    link: "https://www.github.com/alimasyhur",
  },
  {
    icon: "mdi-linkedin",
    link: "https://www.linkedin.com/in/alimasyhur",
  },
  {
    icon: "mdi-instagram",
    link: "https://www.instagram.com/_alimasyhur/",
  },
]
</script>
