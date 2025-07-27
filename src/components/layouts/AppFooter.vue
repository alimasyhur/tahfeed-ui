<template>
  <v-footer class="bg-grey-darken-4 text-white pa-8">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <h3 class="text-h5 font-weight-bold mb-4">
            <span class="text-green-darken-4">tah</span><span class="text-green-accent-3">feed</span>
          </h3>
          <p class="text-body-2 text-grey-lighten-2">
            Platform digital terdepan untuk monitoring hafalan Al-Qur'an dengan teknologi modern
            dan pendekatan yang transparan.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <div class="text-body-2 text-grey-lighten-2 mb-2">
            © 2024 Tahfeed. Licensed under MIT.
          </div>
          <div class="d-flex justify-center justify-md-end ga-4">
            <v-btn icon size="small" :href="sourceCodeLink" target="_blank">
              <v-icon icon="mdi-github"></v-icon>
            </v-btn>
            <v-btn icon size="small" :href="contactUsLink" target="_blank">
              <v-icon icon="mdi-whatsapp"></v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
const sourceCodeLink = "https://github.com/alimasyhur";
const contactUsLink = "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0AOrganisasi%20saya%20ingin%20bergabung%20bersama%20tahfeed.%20Bagaimana%20caranya%20ya%3F%0ATerimakasih";
</script>
