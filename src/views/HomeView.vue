<template>
  <div class="homepage">
    <!-- Hero Section with Modern Gradient -->
    <v-container fluid class="hero-section pa-0">
      <div class="hero-gradient">
        <v-container class="py-16">
          <v-row align="center" justify="center" class="min-height-screen">
            <v-col cols="12" lg="6" class="text-center text-lg-left">
              <v-fade-transition appear>
                <div>
                  <h1 class="hero-title mb-6">
                    <span class="text-green-darken-4 font-weight-black">tah</span><span
                      class="text-green-accent-3 font-weight-black">feed</span>
                    <br />
                    <span class="hero-subtitle">Feed Your Iman with</span>
                    <br />
                    <small><span class="text-gradient">Memorizing Qur'an</span></small>
                  </h1>

                  <p class="text-h6 text-grey-darken-2 mb-8 font-weight-regular">
                    Platform digital revolusioner untuk monitoring hafalan Al-Qur'an dengan
                    <strong class="text-green-darken-3">automasi pintar</strong> dan
                    <strong class="text-green-darken-3">tracking transparan</strong>.
                  </p>

                  <div class="d-flex flex-column flex-sm-row ga-4 mb-8">
                    <v-btn color="green-darken-2" size="x-large" class="rounded-xl text-none font-weight-bold"
                      elevation="8" @click="$vuetify.goTo('#features')">
                      <v-icon start icon="mdi-rocket-launch"></v-icon>
                      Mulai Sekarang
                    </v-btn>

                    <v-btn variant="outlined" color="green-darken-2" size="x-large"
                      class="rounded-xl text-none font-weight-medium" @click="dialog = true">
                      <v-icon start icon="mdi-play-circle"></v-icon>
                      Lihat Demo
                    </v-btn>
                  </div>

                  <!-- Stats -->
                  <!-- <div class="d-flex flex-wrap justify-center justify-lg-start ga-6">
                    <div class="text-center" v-for="stat in stats" :key="stat.label">
                      <div class="text-h4 font-weight-bold text-green-darken-3">{{ stat.value }}</div>
                      <div class="text-caption text-grey-darken-1">{{ stat.label }}</div>
                    </div>
                  </div> -->
                </div>
              </v-fade-transition>
            </v-col>

            <v-col cols="12" lg="6" class="d-flex justify-center">
              <v-slide-x-transition appear>
                <div class="hero-image-container">
                  <div class="floating-card">
                    <v-card class="pa-4 rounded-xl" elevation="12">
                      <v-img src="/images/landing/tahfeed-semangat-hafal.png" max-width="1000"
                        class="hero-main-image rounded-xl" />
                      <div class="d-flex align-center mb-2">
                        <v-avatar color="green-lighten-4" class="me-3">
                          <v-icon color="green-darken-3" icon="mdi-book-open-page-variant"></v-icon>
                        </v-avatar>
                        <div>
                          <div class="font-weight-bold">Abdullah</div>
                          <div class="text-caption text-grey-darken-1">Juz 25</div>
                        </div>
                      </div>
                      <v-progress-linear color="green" model-value="75" height="8" rounded></v-progress-linear>
                      <div class="text-caption mt-1">Progress: 80%</div>
                    </v-card>
                  </div>

                </div>
              </v-slide-x-transition>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- Problem Section with Modern Cards -->
    <v-container fluid class="py-16 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Kesulitan dalam Mengelola Tahfidz?
          </h2>
          <p class="text-h6 text-grey-darken-1 mx-auto" style="max-width: 600px;">
            Kami memahami tantangan yang dihadapi dalam pengelolaan program tahfidz
          </p>
        </div>

        <v-row class="">
          <v-col cols="12" md="4" v-for="(problem, i) in problems" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="problem-card h-100 rounded-xl" :elevation="isHovering ? 12 : 4"
                :class="{ 'transform-hover': isHovering }">
                <div class="problem-icon-bg"></div>
                <v-card-text class="pa-8 text-center">
                  <v-avatar size="80" class="mb-6" color="red-lighten-4">
                    <v-icon size="40" color="red-darken-2" :icon="problem.icon"></v-icon>
                  </v-avatar>
                  <h3 class="text-h5 font-weight-bold mb-4 text-grey-darken-3">
                    {{ problem.title }}
                  </h3>
                  <p class="text-body-1 text-grey-darken-2">
                    {{ problem.description }}
                  </p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Features Section -->
    <v-container id="features" fluid class="py-16">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            <span class="text-green-darken-4">tah</span><span class="text-green-accent-3">feed</span>
            adalah solusi modern & transparan
          </h2>
          <p class="text-h6 text-grey-darken-1 mx-auto" style="max-width: 700px;">
            Platform all-in-one yang mengotomatisasi proses monitoring dan memberikan transparansi penuh
          </p>
        </div>

        <v-row>
          <v-col cols="12" sm="6" lg="4" v-for="(feature, i) in features" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="feature-card h-100 rounded-xl" :elevation="isHovering ? 12 : 2"
                :class="{ 'transform-hover': isHovering }">
                <div class="feature-gradient"></div>
                <v-card-text class="pa-8 text-center position-relative">
                  <v-avatar size="80" class="mb-6" :color="feature.color">
                    <v-icon size="40" color="white" :icon="feature.icon"></v-icon>
                  </v-avatar>
                  <h3 class="text-h5 font-weight-bold mb-4 text-grey-darken-3">
                    {{ feature.title }}
                  </h3>
                  <p class="text-body-1 text-grey-darken-2">
                    {{ feature.description }}
                  </p>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Testimonial Section -->
    <!-- <v-container fluid class="py-16 bg-green-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <v-chip color="green-lighten-4" text-color="green-darken-3" class="mb-4">
            <v-icon start icon="mdi-heart"></v-icon>
            Testimoni Pengguna
          </v-chip>
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Dipercaya oleh Ribuan Lembaga
          </h2>
        </div>

        <v-row>
          <v-col cols="12" md="4" v-for="(testimonial, i) in testimonials" :key="i">
            <v-card class="rounded-xl h-100" elevation="4">
              <v-card-text class="pa-6">
                <div class="d-flex mb-4">
                  <v-rating v-model="testimonial.rating" color="amber" density="compact" readonly></v-rating>
                </div>
                <p class="text-body-1 mb-4 font-italic">
                  "{{ testimonial.text }}"
                </p>
                <div class="d-flex align-center">
                  <v-avatar color="green-lighten-3" class="me-3">
                    <span class="text-white font-weight-bold">
                      {{ testimonial.name.charAt(0) }}
                    </span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ testimonial.name }}</div>
                    <div class="text-caption text-grey-darken-1">{{ testimonial.position }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container> -->

    <!-- CTA Section -->
    <v-container fluid class="cta-section py-16">
      <v-container>
        <div class="text-center text-white">
          <h2 class="text-h3 font-weight-bold mb-4">
            Siap Memulai Revolusi Tahfidz?
          </h2>
          <!-- <p class="text-h6 mb-8 mx-auto" style="max-width: 600px;">
            Bergabunglah dengan ribuan lembaga yang telah merasakan kemudahan
            <strong>tahfeed</strong> - 100% gratis dan open source!
          </p> -->

          <div class="d-flex flex-column flex-sm-row justify-center ga-4 mb-8">
            <v-btn size="x-large" color="white" class="rounded-xl text-none font-weight-bold text-green-darken-2"
              elevation="8" :href="contactUsLink" target="_blank">
              <v-icon start icon="mdi-whatsapp" color="green"></v-icon>
              Hubungi Kami Sekarang
            </v-btn>

            <v-btn size="x-large" variant="outlined" color="white" class="rounded-xl text-none font-weight-medium"
              :href="sourceCodeLink" target="_blank">
              <v-icon start icon="mdi-github"></v-icon>
              Lihat Source Code
            </v-btn>
          </div>

          <div class="d-flex justify-center align-center ga-8 flex-wrap">
            <!-- <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>100% Gratis</span>
            </div> -->
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>Open Source</span>
            </div>
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-check-circle" color="green-lighten-2"></v-icon>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </v-container>
    </v-container>

    <!-- Demo Modal -->
    <v-dialog v-model="dialog" max-width="900px">
      <v-card class="rounded-xl">
        <v-card-title class="text-h5 font-weight-bold pa-6">
          <v-icon icon="mdi-play-circle" class="me-2" color="green"></v-icon>
          Demo Tahfeed Platform
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <div style="position: relative; padding-bottom: 56.25%; height: 0;">
            <iframe :src="demoVideoUrl" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
              frameborder="0" allowfullscreen></iframe>
          </div>
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="green" variant="outlined" class="rounded-lg" @click="dialog = false">
            Tutup
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      demoVideoUrl: "https://www.youtube.com/embed/1KzUByZ6bWk",

      stats: [
        { value: '10K+', label: 'Pengguna Aktif' },
        { value: '500+', label: 'Lembaga' },
        { value: '99%', label: 'Kepuasan' }
      ],

      problems: [
        {
          icon: 'mdi-file-document-edit',
          title: 'Laporan Manual',
          description: 'Pembuatan laporan hafalan yang memakan waktu dan rawan kesalahan karena masih dilakukan secara manual.'
        },
        {
          icon: 'mdi-eye-off',
          title: 'Kurang Transparansi',
          description: 'Progress hafalan siswa tidak dapat dimonitor secara real-time oleh orang tua dan pengelola.'
        },
        {
          icon: 'mdi-database-remove',
          title: 'Data Tidak Terorganisir',
          description: 'Informasi siswa dan guru tersebar di berbagai tempat dan tidak tercatat dengan rapi.'
        }
      ],

      features: [
        {
          icon: 'mdi-devices',
          title: 'Multi-Platform',
          description: 'Akses dari desktop, tablet, atau smartphone kapan saja dan dimana saja.',
          color: 'blue'
        },
        {
          icon: 'mdi-lightning-bolt',
          title: 'Super Cepat',
          description: 'Buat laporan bulanan hanya dalam hitungan menit, bukan jam.',
          color: 'orange'
        },
        {
          icon: 'mdi-eye-outline',
          title: 'Transparan Penuh',
          description: 'Semua histori tercatat rapi dan dapat diakses oleh wali dan pengelola.',
          color: 'green'
        },
        {
          icon: 'mdi-shield-check',
          title: 'Keamanan Tinggi',
          description: 'Data dilindungi dengan enkripsi dan hanya admin organisasi yang dapat mengakses.',
          color: 'red'
        },
        {
          icon: 'mdi-cog',
          title: 'Sangat Fleksibel',
          description: 'Dapat disesuaikan untuk berbagai jenis program dan aktivitas tahfidz.',
          color: 'purple'
        },
        {
          icon: 'mdi-calendar-clock',
          title: 'Support Lengkap',
          description: 'Dibantu oleh tim dukungan profesional untuk memastikan sistem berjalan lancar.',
          color: 'teal'
        }
      ],

      testimonials: [
        {
          name: 'Ustadz Ahmad Fauzi',
          position: 'Direktur Ponpes Al-Hikmah',
          text: 'Tahfeed sangat membantu kami dalam mengelola 200+ santri. Laporan yang tadinya butuh 2 hari, sekarang hanya 30 menit!',
          rating: 5
        },
        {
          name: 'Ummu Salma',
          position: 'Wali Santri',
          text: 'Sebagai orang tua, saya sangat terbantu bisa memantau progress hafalan anak secara real-time melalui aplikasi ini.',
          rating: 5
        },
        {
          name: 'Ustadzah Khadijah',
          position: 'Koordinator Tahfidz',
          text: 'Interface yang mudah dipahami dan fitur yang lengkap. Tim support juga sangat responsif membantu.',
          rating: 5
        }
      ],

      sourceCodeLink: "https://github.com/alimasyhur/tahfeed-ui",
      contactUsLink: "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0AOrganisasi%20saya%20ingin%20bergabung%20bersama%20tahfeed.%20Bagaimana%20caranya%20ya%3F%0ATerimakasih"
    }
  }
}
</script>

<style scoped>
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

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 400;
  color: #616161;
}

.text-gradient {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
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
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
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

.problem-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.problem-icon-bg {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(255, 193, 7, 0.1));
  border-radius: 50%;
}

.feature-card {
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

  .text-h5 {
    font-size: 1.3rem !important;
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