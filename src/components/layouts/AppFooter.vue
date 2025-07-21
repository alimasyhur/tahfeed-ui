<template>
  <v-footer class="bg-teal-darken-4 text-center d-flex flex-column justify-center align-center" height="auto"
    style="padding: 16px 8px;" app>
    <div class="mb-2">
      <v-btn v-for="{ icon, link } in icons" :key="icon" class="mx-2" :icon="icon" variant="text" size="small"
        :href="link" target="_blank"></v-btn>
    </div>

    <div class="text-white text-body-2 mb-1">
      We dedicated our live for Qur'an
    </div>

    <v-divider class="my-2" color="white" style="width: 100px;"></v-divider>

    <div class="text-white text-caption">
      {{ new Date().getFullYear() }} — built with
      <v-icon icon="mdi-heart" color="red" size="small" class="mx-1"></v-icon> by
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
];
</script>
