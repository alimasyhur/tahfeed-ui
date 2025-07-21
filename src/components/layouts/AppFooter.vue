<template>
  <v-footer class="bg-teal-darken-4 text-center d-flex flex-column justify-center text-white" height="100">
    <div>
      <v-btn v-for="{ icon, link } in icons" :key="icon" class="mx-2" :icon="icon" variant="text" target="_blank"
        :href="link" />
    </div>

    <div class="pt-1 text-caption">
      We dedicated our live for Qur'an
    </div>

    <v-divider class="my-1" color="white" />

    <div class="text-caption">
      {{ new Date().getFullYear() }} — built with
      <v-icon icon="mdi-heart" color="red" size="small" /> by
      <strong>tahfeed</strong>
    </div>
  </v-footer>
</template>

<script setup>
const icons = [
  { icon: "mdi-github", link: "https://github.com/alimasyhur" },
  { icon: "mdi-linkedin", link: "https://linkedin.com/in/alimasyhur" },
  { icon: "mdi-instagram", link: "https://instagram.com/_alimasyhur/" },
];
</script>
