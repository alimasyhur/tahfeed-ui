<template>
  <v-footer class="bg-teal-darken-4 text-center d-flex flex-column">
    <div>
      <v-btn v-for="{ icon, link } in icons" :key="icon" class="mx-4" :icon="icon" variant="text" target="#"
        :href="link"></v-btn>
    </div>

    <div class="pt-0">
      We dedicated our live for Qur'an
    </div>

    <v-divider></v-divider>

    <div>
      {{ new Date().getFullYear() }} — built with <v-icon icon="mdi-heart" color="red"></v-icon> by
      <strong>tahfeed</strong>
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  // {
  //   "icon": "mdi-facebook",
  //   "link": "https://www.facebook.com/ali.masyhur1/",
  // },
  // {
  //   "icon": "mdi-twitter",
  //   "link": "https://twitter.com/_alimasyhur",
  // },
  {
    "icon": "mdi-github",
    "link": "https://www.github.com/alimasyhur",
  },
  {
    "icon": "mdi-linkedin",
    "link": "https://www.linkedin.com/in/alimasyhur",
  },
  {
    "icon": "mdi-instagram",
    "link": "https://www.instagram.com/_alimasyhur/",
  }
]
</script>
