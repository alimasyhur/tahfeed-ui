<template>
  <div>
    <v-row>
      <v-col cols="12" class="mt-12">
        <v-row>
          <v-col cols="6">
            <v-row class="ma-12">
              <div class="text-h3 my-6 mx-12 fill-height text-green-darken-4">
                <v-img :width="200" aspect-ratio="16/9" cover class="rounded-image"
                  src="/images/landing/img_desk.svg"></v-img>
                <b class="text-green-darken-4">A small team</b> <b class="text-green-darken-1">tah</b><b
                  class="text-green-lighten-4">feed</b><b class="text-green-darken-4"> with a big vision</b>
              </div>
            </v-row>
          </v-col>

          <v-col cols="4" class="fill-height">
            <!-- <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-target.svg"></v-img> -->
            <v-img :width="500" aspect-ratio="4/4" cover class="rounded-image"
              src="/images/landing/tahfeed-semangat.png"></v-img>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <v-row style="background-color: white; min-height: 400px;">
      <v-col cols="12">
        <v-row class="mx-12 justify-center align-center text-green-darken-4">
          <v-col cols="4">
          </v-col>
          <v-col cols="4">
            <v-row class="mx-12 my-6 justify-center align-center">
              <v-col cols="12" class="text-h1 text-center">
                <v-avatar image="/images/landing/owner.png" size="200"></v-avatar>
              </v-col>
              <v-col cols="12" class="text-h4 text-center">
                Ali Masyhur
              </v-col>
              <v-col cols="12" class="text-h5 text-center">Owner / Creator</v-col>
              <v-col cols="12" class="text-p text-center">Sukoharjo, Jawa Tengah, Indonesia</v-col>
            </v-row>
          </v-col>
          <v-col cols="4">
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="mb-4">
        <div class="text-h5 justify-center align-center text-center">Github Contributor</div>
        <p class="justify-center align-center text-center" v-for="(contributor, i) in contributors" :key="i">
          <v-btn class="not-uppercase" color="default" type="button" prepend-icon="mdi-github" target="#"
            :href="contributor.link">
            {{ contributor.name }}
          </v-btn>
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slides: [
        {
          src: "/images/landing/img_problem_01.svg",
          text: "Does it take a long time to prepare the students' Qur'an memorization progress report?",
        },
        {
          src: "/images/landing/img_problem_02.svg",
          text: "Is the students' Qur'an memorization progress not being monitored in a detailed and transparent manner?",
        },
        {
          src: "/images/landing/img_problem_03.svg",
          text: "Are the students' and teachers' data disorganized and lacking proper historical records?",
        },
      ],
      contributors: [
        {
          link: "https://github.com/alimasyhur",
          name: "alimasyhur",
        }
      ],
      sourceCodeLink: "https://github.com/alimasyhur/tahfeed-ui",
      contactUsLink: "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0AOrganisasi%20saya%20ingin%20bergabung%20bersama%20tahfeed.%20Bagaimana%20caranya%20ya%3F%0ATerimakasih",
    }
  },
}
</script>

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