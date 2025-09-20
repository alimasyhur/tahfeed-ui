<template>
  <div class="donateview">
    <!-- Hero Section -->
    <v-container fluid class="hero-section pa-0">
      <div class="hero-gradient">
        <v-container class="py-16">
          <v-row align="center" justify="center" class="min-height-screen">
            <v-col cols="12" lg="6" class="text-center text-lg-left">
              <v-fade-transition appear>
                <div>
                  <h1 class="hero-title mb-6">
                    How can <span class="text-green-darken-4 font-weight-black">tah</span><span
                      class="text-green-accent-3 font-weight-black">feed</span> grow?
                  </h1>

                  <p class="text-h6 text-grey-darken-2 mb-8 font-weight-regular">
                    <span class="text-green-darken-4 font-weight-bold">tah</span><span
                      class="text-green-accent-3 font-weight-bold">feed</span>
                    adalah platform <strong class="text-green-darken-3">100% gratis</strong> yang didukung oleh
                    donasi dari individu dan perusahaan untuk menjaga layanan tetap dapat diakses semua orang.
                  </p>

                  <div class="d-flex flex-column flex-sm-row ga-4 mb-8">
                    <v-btn color="green-darken-2" size="x-large" class="rounded-xl text-none font-weight-bold"
                      elevation="8" @click="$vuetify.goTo('#donation-card')">
                      <v-icon start icon="mdi-heart"></v-icon>
                      Donasi Sekarang
                    </v-btn>

                    <v-btn variant="outlined" color="green-darken-2" size="x-large"
                      class="rounded-xl text-none font-weight-medium" @click="$vuetify.goTo('#fund-usage')">
                      <v-icon start icon="mdi-information"></v-icon>
                      Penggunaan Dana
                    </v-btn>
                  </div>
                </div>
              </v-fade-transition>
            </v-col>

            <v-col cols="12" lg="6" class="d-flex justify-center">
              <v-slide-x-transition appear>
                <div class="hero-image-container">
                  <div class="floating-card">
                    <v-img :width="300" aspect-ratio="16/9" cover class="rounded-image mx-auto"
                      src="/images/landing/tahfeed-donate.png" />
                  </div>
                </div>
              </v-slide-x-transition>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- Impact Stats Section -->
    <v-container fluid class="py-16 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Bersama Membangun Masa Depan Tahfidz
          </h2>
        </div>

        <v-row>
          <v-col cols="12" sm="6" lg="4" v-for="(impact, i) in impactStats" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="impact-card h-100 rounded-xl text-center pa-6"
                :elevation="isHovering ? 12 : 4" :class="{ 'transform-hover': isHovering }">
                <div class="feature-gradient"></div>
                <v-avatar size="80" class="mb-4" :color="impact.color">
                  <v-icon size="40" color="white" :icon="impact.icon"></v-icon>
                </v-avatar>
                <div class="text-h4 font-weight-bold mb-2 text-green-darken-3">{{ impact.value }}</div>
                <div class="text-h6 font-weight-medium text-grey-darken-2">{{ impact.label }}</div>
                <p class="text-body-2 text-grey-darken-1 mt-2">{{ impact.description }}</p>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Donation Card Section -->
    <v-container id="donation-card" fluid class="py-16">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Salurkan Donasi Anda
          </h2>
          <p class="text-h6 text-grey-darken-1 mx-auto" style="max-width: 600px;">
            Donasi Anda akan sangat membantu pengembangan platform dan menjaga layanan tetap berkelanjutan
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="donation-card rounded-xl pa-8" :elevation="isHovering ? 16 : 8"
                :class="{ 'transform-hover': isHovering }">
                <div class="feature-gradient"></div>

                <!-- Bank Header -->
                <div class="d-flex justify-space-between align-center mb-6">
                  <div>
                    <v-chip color="blue-lighten-4" text-color="blue-darken-3" class="mb-2">
                      <v-icon start icon="mdi-bank"></v-icon>
                      Rekening Donasi Resmi
                    </v-chip>
                    <h3 class="text-h5 font-weight-bold text-grey-darken-3">Bank Syariah Indonesia</h3>
                  </div>
                  <v-img src="/images/landing/bank_bsi.png" max-width="100" contain class="bank-logo" />
                </div>

                <!-- Account Number -->
                <div class="account-section mb-6">
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption text-grey-darken-1 mb-1">NOMOR REKENING</div>
                      <div class="text-h4 font-weight-bold text-green-darken-3 font-mono">2854793820</div>
                    </div>
                    <v-btn icon variant="text" color="green" @click="copyAccountNumber">
                      <v-icon>mdi-content-copy</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Account Details Grid -->
                <v-row class="mb-6">
                  <v-col cols="12" sm="4">
                    <div class="detail-card">
                      <div class="text-caption text-grey-darken-1 mb-1">NAMA BANK</div>
                      <div class="text-h6 font-weight-bold text-grey-darken-3">Bank BSI</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="5">
                    <div class="detail-card">
                      <div class="text-caption text-grey-darken-1 mb-1">ATAS NAMA</div>
                      <div class="text-h6 font-weight-bold text-grey-darken-3">Muhammad Ali Masyur</div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="detail-card">
                      <div class="text-caption text-grey-darken-1 mb-1">KODE BANK</div>
                      <div class="text-h6 font-weight-bold text-grey-darken-3">451</div>
                    </div>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- WhatsApp Confirmation -->
                <div class="text-center mb-6">
                  <v-btn size="x-large" color="green" class="rounded-xl text-none font-weight-bold" elevation="8"
                    :href="whatsappLink" target="_blank">
                    <v-icon start icon="mdi-whatsapp"></v-icon>
                    Konfirmasi Donasi via WhatsApp
                  </v-btn>
                </div>

                <!-- Security Notice -->
                <v-card class="pa-4 rounded-lg" color="orange-lighten-5" variant="outlined">
                  <div class="d-flex align-start ga-3">
                    <v-icon color="orange-darken-2" size="24">mdi-shield-alert</v-icon>
                    <div>
                      <div class="font-weight-bold text-orange-darken-3 mb-1">PERHATIAN PENTING!</div>
                      <div class="text-body-2 text-grey-darken-2">
                        <span class="text-green-darken-4 font-weight-bold">tah</span><span
                          class="text-green-accent-3 font-weight-bold">feed</span>
                        hanya memiliki 1 rekening sesuai info di atas. Hubungi kami jika menemukan rekening donasi yang
                        mencurigakan.
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Fund Usage Section -->
    <v-container id="fund-usage" fluid class="py-16 bg-grey-lighten-5">
      <v-container>
        <v-row align="center">
          <v-col cols="12" lg="6" class="mb-8 mb-lg-0">
            <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-6">
              Pemanfaatan Dana Donasi
            </h2>
            <p class="text-h6 text-grey-darken-1 mb-6">
              Donasi Anda akan sangat membantu pengembangan proyek ini dan menjaga layanan tetap berkelanjutan.
            </p>
            <div class="text-center text-lg-left">
              <div class="text-h6 font-weight-medium text-green-darken-3 mb-2">
                جَزَاكُمُ اللَّهُ خَيْرًا كَثِيرًا
              </div>
              <p class="text-body-1 text-grey-darken-2 font-italic">
                "Jazakumullahu khairan katsiran, semoga Allah membalas kalian dengan kebaikan yang banyak."
              </p>
            </div>
          </v-col>

          <v-col cols="12" lg="6">
            <v-card class="rounded-xl pa-6" elevation="8">
              <div class="feature-gradient"></div>
              <h3 class="text-h5 font-weight-bold text-grey-darken-3 mb-6">Alokasi Dana Donasi</h3>

              <div class="usage-list">
                <div v-for="(usage, i) in donationUsage" :key="i" class="usage-item">
                  <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props" class="usage-card" :class="{ 'usage-hover': isHovering }">
                      <div class="d-flex align-center ga-4">
                        <v-avatar size="50" :color="usage.color">
                          <v-icon color="white" :icon="usage.icon"></v-icon>
                        </v-avatar>
                        <div class="flex-grow-1">
                          <div class="text-h6 font-weight-bold text-grey-darken-3">{{ usage.title }}</div>
                          <div class="text-body-2 text-grey-darken-1">{{ usage.description }}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-h6 font-weight-bold" :class="usage.color">{{ usage.percentage }}</div>
                          <div class="text-caption text-grey-darken-1">dari total</div>
                        </div>
                      </div>
                      <v-progress-linear :color="usage.color.replace('text-', '')"
                        :model-value="parseInt(usage.percentage)" height="6" rounded class="mt-3">
                      </v-progress-linear>
                    </div>
                  </v-hover>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Call to Action Section -->
    <v-container fluid class="cta-section py-16">
      <v-container>
        <div class="text-center text-white">
          <h2 class="text-h3 font-weight-bold mb-4">
            Mari Bersama Membangun Masa Depan Tahfidz
          </h2>
          <p class="text-h6 mb-8 mx-auto" style="max-width: 700px;">
            Setiap donasi Anda, sekecil apapun, akan memberikan dampak besar bagi ribuan penghafal Al-Qur'an di seluruh
            Indonesia
          </p>

          <div class="d-flex flex-column flex-sm-row justify-center ga-4 mb-8">
            <v-btn size="x-large" color="white" class="rounded-xl text-none font-weight-bold text-green-darken-2"
              elevation="8" @click="$vuetify.goTo('#donation-card')">
              <v-icon start icon="mdi-heart" color="red"></v-icon>
              Donasi Sekarang
            </v-btn>

            <v-btn size="x-large" variant="outlined" color="white" class="rounded-xl text-none font-weight-medium"
              :href="whatsappLink" target="_blank">
              <v-icon start icon="mdi-whatsapp"></v-icon>
              Hubungi Kami
            </v-btn>
          </div>

          <div class="d-flex justify-center align-center ga-8 flex-wrap">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>Continous Development</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>Community Driven</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </v-container>
    </v-container>

    <!-- Snackbar for copy notification -->
    <v-snackbar v-model="snackbar" timeout="3000" color="green">
      <v-icon start>mdi-check-circle</v-icon>
      Nomor rekening berhasil disalin!
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'DonateView',
  data() {
    return {
      snackbar: false,

      impactStats: [
        {
          icon: 'mdi-server',
          value: '24/7',
          label: 'Server Uptime',
          description: 'Menjaga platform selalu dapat diakses',
          color: 'blue'
        },
        {
          icon: 'mdi-domain',
          value: '1',
          label: 'Domain Aktif',
          description: 'Akses mudah melalui tahfeed.com',
          color: 'green'
        },
        {
          icon: 'mdi-flask',
          value: '∞',
          label: 'Riset Berkelanjutan',
          description: 'Inovasi fitur-fitur baru',
          color: 'purple'
        },
        // {
        //   icon: 'mdi-account-group',
        //   value: '1000+',
        //   label: 'Pengguna Aktif',
        //   description: 'Yang merasakan manfaat platform',
        //   color: 'orange'
        // }
      ],

      donationUsage: [
        {
          title: 'Server & Hosting',
          description: 'Biaya server dan maintenance bulanan untuk menjaga platform tetap online 24/7',
          percentage: '60%',
          color: 'text-blue-darken-2',
          icon: 'mdi-server'
        },
        {
          title: 'Domain & SSL',
          description: 'Biaya perpanjangan domain tahfeed.com dan sertifikat keamanan SSL',
          percentage: '20%',
          color: 'text-green-darken-2',
          icon: 'mdi-domain'
        },
        {
          title: 'Research & Development',
          description: 'Pengembangan fitur baru dan peningkatan user experience platform',
          percentage: '20%',
          color: 'text-purple-darken-2',
          icon: 'mdi-flask'
        }
      ],

      whatsappLink: "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0ASaya%20ingin%20mengkonfirmasi%20donasi%20untuk%20tahfeed"
    }
  },

  methods: {
    copyAccountNumber() {
      navigator.clipboard.writeText('2854793820').then(() => {
        this.snackbar = true;
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = '2854793820';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.snackbar = true;
      });
    }
  }
}
</script>

<style scoped>
.donateview {
  position: relative;
}

/* Hero Section */
.hero-section {
  position: relative;
  overflow: hidden;
}

.hero-gradient {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #fff 100%);
  position: relative;
}

.hero-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="75" r="1" fill="%23000" opacity="0.02"/><circle cx="25" cy="75" r="1" fill="%23000" opacity="0.02"/><circle cx="75" cy="25" r="1" fill="%23000" opacity="0.02"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  pointer-events: none;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
}

.min-height-screen {
  min-height: 80vh;
}

.hero-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-main-image {
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.1));
  transition: all 0.3s ease;
}

.floating-card {
  position: absolute;
  top: -20px;
  right: -20px;
  z-index: 2;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Cards */
.impact-card,
.donation-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4caf50, #66bb6a, #81c784);
}

.transform-hover {
  transform: translateY(-8px);
}

/* Account Section */
.account-section {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.1));
  border-radius: 16px;
  padding: 24px;
  border: 2px dashed #4caf50;
}

.font-mono {
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

.detail-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.bank-logo {
  border-radius: 8px;
  background: white;
  padding: 8px;
}

/* Usage List */
.usage-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.usage-item {
  transition: all 0.3s ease;
}

.usage-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.usage-hover {
  transform: translateX(8px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%);
  position: relative;
}

.cta-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%23fff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
  pointer-events: none;
}

/* Mobile Optimizations */
@media (max-width: 960px) {
  .hero-title {
    text-align: center;
  }

  .floating-card {
    position: static;
    margin-bottom: 20px;
  }

  .d-flex.flex-column.flex-sm-row {
    align-items: stretch;
  }

  .d-flex.flex-column.flex-sm-row .v-btn {
    width: 100%;
  }

  .account-section {
    padding: 16px;
  }

  .font-mono {
    font-size: 1.8rem;
  }
}

@media (max-width: 600px) {
  .hero-gradient {
    padding-top: 60px;
  }

  .py-16 {
    padding-top: 48px !important;
    padding-bottom: 48px !important;
  }

  .text-h3 {
    font-size: 1.8rem !important;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }

  .donation-card {
    margin: 16px;
  }

  .usage-hover {
    transform: none;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Loading animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.v-card {
  animation: slideInUp 0.6s ease-out;
}
</style>