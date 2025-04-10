<template>
  <div>
    <v-row style="background-color: white; min-height: 500px;">
      <v-col cols="12" class="mt-12">
        <v-row>
          <v-col cols="6">
            <v-row class="ma-12">
              <div class="text-h2 my-6 mx-12 fill-height text-green-darken-4">
                How can <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> grow?
              </div>
            </v-row>
          </v-col>

          <v-col cols="4" class="fill-height">
            <!-- <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-target.svg"></v-img> -->
            <v-img :width="500" aspect-ratio="16/9" cover class="rounded-image"
              src="/images/landing/tahfeed-donate.png"></v-img>
          </v-col>

        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <v-row class="ma-12">
              <div class="text-h3 mx-12 text-green-darken-4">
                Donations from the donors
              </div>
              <div class="text-h5 mx-12 text-green-darken-3">
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is 100% funded by
                donations from individual and corporate donors to ensure that this service remains free.
              </div>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row class="ma-12">
              <div class="text-h4">
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> donation
              </div>

              <div class="mt-4">
                <v-row align="left" justify="center" dense>
                  <v-col cols="12" md="12">
                    <v-card class="pa-4" outlined>
                      <v-card-subtitle class="d-flex justify-space-between align-center">
                        <span class="text-p">No Rekening</span>
                        <v-img src="/images/landing/bank_bsi.png" max-width="80" max-height="80" contain
                          class="ml-4"></v-img>
                      </v-card-subtitle>
                      <v-card-title class="d-flex justify-space-between align-center">
                        <span class="text-h6"><b>2854793820</b></span>
                      </v-card-title>

                      <br>

                      <v-row align="center" no-gutters>
                        <v-col class="text-left" cols="3">
                          <v-card-subtitle class="d-flex align-center">
                            <span class="text-p">Nama Bank</span>
                          </v-card-subtitle>
                          <v-card-title class="d-flex align-center">
                            <span class="text-p align-right text-right"><b>Bank BSI</b></span>
                          </v-card-title>
                        </v-col>

                        <v-col class="text-left" cols="6">
                          <v-card-subtitle class="d-flex align-center">
                            <span class="text-p">Atas Nama</span>
                          </v-card-subtitle>
                          <v-card-title class="d-flex align-center">
                            <span class="text-p align-right text-right"><b>Muhammad Ali Masyur</b></span>
                          </v-card-title>
                        </v-col>

                        <v-col class="text-right alight-right" cols="3">
                          <v-card-subtitle class="d-flex align-right">
                            <span class="text-p align-right text-right">Kode Bank</span>
                          </v-card-subtitle>
                          <v-card-title class="d-flex align-right">
                            <span class="text-p align-right text-right"><b>451</b></span>
                          </v-card-title>
                        </v-col>
                      </v-row>
                      <template v-slot:actions>
                        <v-btn class="not-uppercase" prepend-icon="mdi-whatsapp" color="green-lighten-2"
                          variant="outlined" block target="#"
                          href="https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum">Konfirmasi
                          donasi via Whatsapp : wa.me/6281548004800</v-btn>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <div>
                <br>
                <p><small>
                    <i>
                      <b>*Perhatian <br></b>
                      <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> hanya memiliki 1
                      rekening
                      sesuai info diatas. Hubungi kami jika menemukan rekening donasi
                      yang mencurigakan.
                    </i>
                  </small>
                </p>
              </div>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="background-color: white; min-height: 500px;">
      <v-col cols="12" class="mt-6">
        <v-row>
          <v-col cols="6">
            <v-row class="ma-6">
              <div class="text-h5 my-6 mx-12 fill-height text-green-darken-4">
                Your donation will greatly help to develop this project and keep the service sustainable.

                <br><br>

                Jazakumullahu khairan katsiran, may Allah reward you with much goodness.
              </div>
            </v-row>
          </v-col>

          <v-col cols="6" class="fill-height">
            <v-row class="ma-12">
              <div class="text-h4 fill-height text-left">Utilization of Donation Funds</div>
              <br>
              <br>
              <div class="text-p fill-height text-left">
                <ul class="check-list" v-for="(usage, i) in donationUsage" :key="i">
                  <li>
                    <v-icon left color="green" class="mr-2">mdi-check-circle</v-icon>
                    {{ usage }}
                  </li>
                </ul>
              </div>
            </v-row>
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
      donationUsage: [
        'Server rental and maintenance costs.',
        'tahfeed.com domain rental cost.',
        'Research and Development',
      ]
    }
  },
}
</script>

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

.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.check-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
}
</style>