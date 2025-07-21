<template>
  <v-container fluid>
    <!-- Hero Section -->
    <v-row class="mt-12" align="center" justify="center">
      <v-col cols="12" md="6" class="text-center">
        <v-img :width="200" aspect-ratio="16/9" cover class="rounded-image mx-auto"
          src="/images/landing/img_desk.svg" />
        <div class="text-h4 text-green-darken-4 mt-4">
          <b class="text-green-darken-4">A small team</b>&nbsp;
          <b class="text-green-darken-1">tah</b><b class="text-green-lighten-4">feed</b>
          <b class="text-green-darken-4"> with a big vision</b>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-center">
        <v-img max-width="300" aspect-ratio="4/4" cover class="rounded-image mx-auto"
          src="/images/landing/tahfeed-semangat.png" />
      </v-col>
    </v-row>

    <!-- Owner Profile -->
    <v-row class="mt-12" style="background-color: white;">
      <v-col cols="12" md="4" />
      <v-col cols="12" md="4" class="text-center">
        <v-avatar image="/images/landing/owner.png" size="200" class="mx-auto mb-4" />
        <div class="text-h5">Ali Masyhur</div>
        <div class="text-subtitle-1">Owner / Creator</div>
        <div class="text-body-2">Sukoharjo, Jawa Tengah, Indonesia</div>
      </v-col>
      <v-col cols="12" md="4" />
    </v-row>

    <!-- Contributors Section -->
    <v-row class="mt-8 mb-12">
      <v-col cols="12" class="text-center">
        <div class="text-h6 mb-2">Github Contributor</div>
        <div v-for="(contributor, i) in contributors" :key="i" class="my-2">
          <v-btn color="default" class="not-uppercase" prepend-icon="mdi-github" :href="contributor.link"
            target="_blank">
            {{ contributor.name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      contributors: [
        {
          link: "https://github.com/alimasyhur",
          name: "alimasyhur",
        },
      ],
    };
  },
};
</script>

<style scoped>
.rounded-image {
  border-radius: 16px;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.rounded-image:hover {
  filter: drop-shadow(0px 6px 10px rgba(0, 0, 0, 0.15)) blur(0.5px);
}
</style>
