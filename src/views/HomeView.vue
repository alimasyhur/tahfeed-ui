<template>
  <div>
    <v-row style="background-color: white; min-height: 500px;">
      <v-col cols="12" class="mt-12">
        <v-row>
          <v-col cols="6">
            <v-row class="ma-12">
              <div class="text-h3 my-6 mx-12 fill-height text-green-darken-4">
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> - Feed Your Iman with
                Memorizing Qur'an
              </div>
              <p class="text-green-darken-6 mx-12">Platform Digital untuk monitoring Hafalan Al-Qur'an kita <br>
                Tingkatkan Produktifitas Anda dengan Automasi dan Tracking Progress Hafalan Qur'an Anda dengan
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b>
                Trackable, Manageable, Transparant, and Many More Lot of Awesome Feature
              </p>
            </v-row>
          </v-col>

          <v-col cols="4" class="fill-height">
            <!-- <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-target.svg"></v-img> -->
            <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-semangat-hafal.png"></v-img>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <v-row class="mx-12">
      <v-col cols="12">
        <v-row>
          <v-carousel height="400" progress="primary" hide-delimiters>
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-sheet height="100%" class="bg-grey-lighten-4">
                <v-row class="d-flex fill-height justify-center align-center" v-if="(i % 2 == 0)">
                  <v-col cols="4">
                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded-image mx-6" :src=slide.src></v-img>
                  </v-col>

                  <v-col cols="8">
                    <v-row class="ma-12">
                      <div class="text-h4 mx-6">
                        {{ slide.text }}
                      </div>
                    </v-row>
                  </v-col>
                </v-row>
                <v-row class="d-flex fill-height justify-center align-center" v-else>
                  <v-col cols="8">
                    <v-row class="ma-12">
                      <div class="text-h4 mx-6">
                        {{ slide.text }}
                      </div>
                    </v-row>
                  </v-col>
                  <v-col cols="4">
                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded-image mx-6" :src=slide.src></v-img>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mb-12" style="background-color: white; min-height: 600px;">
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-row class="ma-12">
              <div class="text-h3 my-6 mx-12 text-center">
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is the solution to the
                issues surrounding tahfidz reporting
                and tahfidz boarding school
                activities.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="mx-12 justify-center align-center text-green-darken-4 mb-4">
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-devices" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Easy to Access
              </div>
              <div class="text-center">
                Access from anywhere as long as there is internet. Via Mobile, Tablet, Laptop, PC.
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-clock-fast" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Simple
              </div>
              <div class="text-center">No need taking much time to create monthly reports.
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-eye-outline" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Transparent
              </div>
              <div class="text-center">
                All history is recorded properly so that it is easy for organizational managers or student guardians to
                see their child's progress or achievements.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row class="mx-12 justify-center align-center text-green-darken-4 mb-4">
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-lock-outline" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Secure
              </div>
              <div class="text-center">
                All data can only be viewed and managed by the organization's admin itself.
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-clipboard-file-outline" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Flexible
              </div>
              <div class="text-center"><b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b>
                can be used for various activities of the Tahfidz Islamic boarding school
                which require recording of Tahfidz.
              </div>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row class="mx-12 justify-center align-center">
              <div class="text-h1">
                <v-icon icon="mdi-book-clock-outline" size="x-large"></v-icon>
              </div>
              <hr>
              <div class="text-h4">
                Scheduling Exam
              </div>
              <div class="text-center">
                Announcements of exam schedules and student memorization achievements can be seen on the website
                dashboard.
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-row class="mb-12">
      <v-col cols="12">
        <v-row class="justify-center align-center">
          <v-col cols="12">
            <div class="text-h3 my-6 mx-12 text-center">
              <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is a free service!
            </div>
            <div class="text-center not-uppercase">Open-source MIT Licensed.
              <br><br>
              <v-btn color="info" type="button" prepend-icon="mdi-github" target="#" :href="sourceCodeLink">
                Source Code
              </v-btn>
              &nbsp;&nbsp;&nbsp;
              <v-btn color="warning" type="button" prepend-icon="mdi-whatsapp" target="#" :href="contactUsLink">
                Contact Us
              </v-btn>
            </div>
          </v-col>
        </v-row>
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