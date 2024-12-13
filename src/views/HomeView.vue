<template>
  <div>
    <v-row style="background-color: white; min-height: 600px;">
      <v-col cols="12" class="mt-12">
        <v-row>
          <v-col cols="6">

            <v-row class="ma-12">
              <h1 class="my-6">
                Feed Your Iman with Memorizing Qur'an
              </h1>
              <p>Platform Digital untuk monitoring Hafalan Al-Qur'an kita <br>
                Tingkatkan Produktifitas Anda dengan Automasi dan Tracking Progress Hafalan Qur'an Anda dengan
                <b>Tahfeed</b>
                Trackable, Manageable, Transparant, and Many More Lot of Awesome Feature
              </p>
            </v-row>

          </v-col>

          <v-col cols="6">
            <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-target.svg"></v-img>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <v-row class="pt-6" style="min-height: 600px;">
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <v-img :ml="5" :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-tracker.svg"></v-img>
          </v-col>

          <v-col cols="6">
            <v-row class="ma-12">
              <h1 class="my-6">
                Best Qur'an Memorization Tracker App
              </h1>
              <p>Easy to use and user friendly. Track your Qur'an Memorization Progress easily and set your target
                and achieve your goals.
              </p>
            </v-row>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <!-- <v-row class="pt-6" style="background-color: white; min-height: 500px;">
      <v-col cols="12">
        <v-row>
          <v-col cols="12" class="text-center">

            <h1>Who Trust Us</h1>

            <v-carousel height="400" hide-delimiters>
              <v-carousel-item v-for="(client, i) in clients" :key="i">
                <v-sheet height="100%">
                  <div class="d-flex fill-height justify-center align-center">
                    <div>
                      <h2>{{ client.name }}</h2>
                      <v-img :width="200" aspect-ratio="16/9" cover src="/images/clients/marsha.png"></v-img>
                      <p>"{{ client.quotes }}"</p>
                      <span>{{ client.owner }}</span>
                    </div>
                  </div>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->

  </div>
</template>

<!-- <script setup>
import { ref } from 'vue';


const clients = ref([
  {
    "name": "Riyadhus Shalihat",
    "owner": "Ustadz Asep Maulana",
    "quotes": "Aplikasi yang bagus untuk men tracking progress menghafal Al-Qur'an Santri",
    "logo": "/images/clients/marsha.png",
  },
  {
    "name": "MITQ Baitul Hikmah",
    "owner": "Ustadz Zaky",
    "quotes": "Aplikasi yang bagus untuk men tracking progress menghafal Al-Qur'an Santri",
    "logo": "/images/clients/marsha.png",
  },
  {
    "name": "Isy Karima",
    "owner": "Ustadz Fulan",
    "quotes": "Aplikasi yang bagus untuk men tracking progress menghafal Al-Qur'an Santri",
    "logo": "/images/clients/marsha.png",
  },
])
</script> -->

<style>
.rounded-image {
  border-radius: 16px;
  /* Rounds the corners */
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1));
  /* Adds blur and shadow */
  overflow: hidden;
  /* Ensures the rounded edges crop the image */
  transition: all 0.3s ease-in-out;
  /* Smooth hover effect */
}

.rounded-image:hover {
  filter: drop-shadow(0px 6px 10px rgba(0, 0, 0, 0.15)) blur(0.5px);
  /* Hover effect for dynamic styling */
}
</style>