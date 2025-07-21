<template>
  <v-container fluid>
    <!-- Section 1: How can tahfeed grow -->
    <v-row align="center" justify="center" class="py-12" style="background-color: white;">
      <v-col cols="12" md="6">
        <div class="text-h4 text-center text-md-left text-green-darken-4 px-4">
          How can <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> grow?
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-center">
        <v-img max-width="400" aspect-ratio="16/9" class="rounded-image mx-auto" cover
          src="/images/landing/tahfeed-donate.png" />
      </v-col>
    </v-row>

    <!-- Section 2: Donation Info -->
    <v-row class="py-12">
      <v-col cols="12" md="6" class="px-4">
        <div class="text-h5 text-green-darken-4 mb-2">Donations from the donors</div>
        <div class="text-body-1 text-green-darken-3">
          <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is 100% funded by donations
          from individual and corporate donors to ensure that this service remains free.
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="ma-4 pa-4" outlined>
          <v-card-subtitle class="d-flex justify-space-between align-center">
            <span>No Rekening</span>
            <v-img src="/images/landing/bank_bsi.png" max-width="80" contain />
          </v-card-subtitle>
          <v-card-title class="text-h6">
            <b>2854793820</b>
          </v-card-title>

          <v-row class="mt-4">
            <v-col cols="12" md="4">
              <div class="text-caption">Nama Bank</div>
              <div><b>Bank BSI</b></div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="text-caption">Atas Nama</div>
              <div><b>Muhammad Ali Masyur</b></div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="text-caption">Kode Bank</div>
              <div><b>451</b></div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-btn class="not-uppercase" prepend-icon="mdi-whatsapp" color="green-lighten-2" variant="outlined" block
            href="https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum" target="_blank">
            Konfirmasi donasi via Whatsapp
          </v-btn>

          <div class="mt-4">
            <small>
              <i>
                <b>*Perhatian:</b> <br />
                <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> hanya memiliki 1 rekening
                sesuai info di atas. Hubungi kami jika menemukan rekening donasi yang mencurigakan.
              </i>
            </small>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section 3: Pemanfaatan Dana -->
    <v-row class="py-12" style="background-color: white;">
      <v-col cols="12" md="6" class="px-4">
        <div class="text-h6 text-green-darken-4 mb-4">
          Your donation will greatly help to develop this project and keep the service sustainable.
        </div>
        <p>Jazakumullahu khairan katsiran, may Allah reward you with much goodness.</p>
      </v-col>
      <v-col cols="12" md="6">
        <div class="text-h5 text-left mb-4">Utilization of Donation Funds</div>
        <ul class="check-list">
          <li v-for="(usage, i) in donationUsage" :key="i">
            <v-icon left color="green" class="mr-2">mdi-check-circle</v-icon>
            {{ usage }}
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      donationUsage: [
        "Server rental and maintenance costs.",
        "tahfeed.com domain rental cost.",
        "Research and Development",
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

.check-list {
  list-style: none;
  padding: 0;
}

.check-list li {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
