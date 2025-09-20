<template>
  <div class="teamview">
    <!-- Hero Section -->
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
                    <span class="hero-subtitle">Team Behind the Vision</span>
                  </h1>

                  <p class="text-h6 text-grey-darken-2 mb-8 font-weight-regular">
                    Tim kecil dengan <strong class="text-green-darken-3">visi besar</strong> untuk merevolusi
                    cara monitoring hafalan Al-Qur'an di seluruh dunia.
                  </p>

                  <div class="d-flex flex-column flex-sm-row ga-4 mb-8">
                    <v-btn color="green-darken-2" size="x-large" class="rounded-xl text-none font-weight-bold"
                      elevation="8" :href="projectLink" target="_blank">
                      <v-icon start icon="mdi-github"></v-icon>
                      Lihat Project
                    </v-btn>

                    <v-btn variant="outlined" color="green-darken-2" size="x-large"
                      class="rounded-xl text-none font-weight-medium" :href="contactLink" target="_blank">
                      <v-icon start icon="mdi-whatsapp"></v-icon>
                      Hubungi Tim
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
                      src="/images/landing/img_desk.svg" />
                  </div>
                </div>
              </v-slide-x-transition>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-container>

    <!-- Stats Section -->
    <v-container fluid class="py-8 bg-grey-lighten-5">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4" v-for="(stat, i) in teamStats" :key="i">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="stat-card h-100 rounded-xl text-center pa-6"
                :elevation="isHovering ? 12 : 4" :class="{ 'transform-hover': isHovering }">
                <div class="feature-gradient"></div>
                <div class="text-h3 font-weight-bold mb-2" :class="stat.color">{{ stat.value }}</div>
                <div class="text-h6 font-weight-medium text-grey-darken-2">{{ stat.label }}</div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Owner Profile Section -->
    <v-container fluid class="py-16">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Man behind Innovation
          </h2>
          <p class="text-h6 text-grey-darken-1 mx-auto" style="max-width: 700px;">
            Developer berpengalaman yang berdedikasi untuk memajukan teknologi tahfidz di Indonesia
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="8" lg="6">
            <v-hover v-slot="{ isHovering, props }">
              <v-card v-bind="props" class="profile-card rounded-xl pa-8 text-center" :elevation="isHovering ? 16 : 8"
                :class="{ 'transform-hover': isHovering }">
                <div class="feature-gradient"></div>

                <div class="profile-avatar mb-6">
                  <v-avatar size="160" class="mx-auto">
                    <v-img src="/images/landing/tahfeed_owner.png" alt="Ali Masyhur" />
                  </v-avatar>
                </div>

                <h3 class="text-h4 font-weight-bold text-green-darken-3 mb-2">Ali Masyhur</h3>
                <div class="text-h6 font-weight-medium text-green-darken-1 mb-3">Founder & Lead Developer</div>

                <div class="d-flex align-center justify-center ga-2 mb-4">
                  <v-icon color="grey-darken-1" size="20">mdi-map-marker</v-icon>
                  <span class="text-body-1 text-grey-darken-1">Sukoharjo, Jawa Tengah, Indonesia</span>
                </div>

                <!-- Profile Stats -->
                <v-row class="mt-6">
                  <v-col cols="12" v-for="(profileStat, i) in profileStats" :key="i">
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold text-green-darken-2">{{ profileStat.value }}</div>
                      <div class="text-caption text-grey-darken-1">{{ profileStat.label }}</div>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Contributors Section -->
    <v-container fluid class="py-16 bg-grey-lighten-5">
      <v-container>
        <div class="text-center mb-12">
          <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            GitHub Contributors
          </h2>
          <p class="text-h6 text-grey-darken-1 mx-auto" style="max-width: 600px;">
            Developer yang berkontribusi dalam pengembangan platform TahFeed
          </p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card class="rounded-xl pa-8" elevation="4">
              <div class="feature-gradient"></div>
              <div class="text-center">
                <div class="d-flex flex-wrap justify-center align-center ga-3 mb-6">
                  <v-chip v-for="(contributor, i) in contributors" :key="i" color="green-darken-2"
                    class="contributor-chip" :href="contributor.link" target="_blank" link>
                    <v-icon start icon="mdi-github"></v-icon>
                    {{ contributor.name }}
                  </v-chip>
                </div>

                <v-divider class="my-6"></v-divider>

                <div class="text-center">
                  <v-icon icon="mdi-account-plus" color="green" size="32" class="mb-4"></v-icon>
                  <h4 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
                    Bergabung dengan Kami
                  </h4>
                  <p class="text-body-1 text-grey-darken-1 mb-4">
                    Kami selalu terbuka untuk kontributor baru yang ingin ikut membangun masa depan tahfidz digital
                  </p>
                  <v-btn color="green-darken-2" class="rounded-lg" :href="projectLink" target="_blank">
                    <v-icon start icon="mdi-rocket-launch"></v-icon>
                    Start Contributing
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- CTA Section -->
    <v-container fluid class="cta-section py-16">
      <v-container>
        <div class="text-center text-white">
          <h2 class="text-h3 font-weight-bold mb-4">
            Siap Bergabung dengan Visi Kami?
          </h2>
          <p class="text-h6 mb-8 mx-auto" style="max-width: 600px;">
            Mari bersama-sama membangun masa depan tahfidz yang lebih modern dan transparan
          </p>

          <div class="d-flex flex-column flex-sm-row justify-center ga-4 mb-8">
            <v-btn size="x-large" color="white" class="rounded-xl text-none font-weight-bold text-green-darken-2"
              elevation="8" :href="contactUsLink" target="_blank">
              <v-icon start icon="mdi-whatsapp" color="green"></v-icon>
              Hubungi Kami Sekarang
            </v-btn>

            <!-- <v-btn size="x-large" variant="outlined" color="white" class="rounded-xl text-none font-weight-medium"
              :href="sourceCodeLink" target="_blank">
              <v-icon start icon="mdi-github"></v-icon>
              Lihat Source Code
            </v-btn> -->
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
  </div>
</template>

<script>
export default {
  name: 'TeamView',
  data() {
    return {
      contributors: [
        {
          link: "https://github.com/alimasyhur",
          name: "alimasyhur",
        },
      ],

      teamStats: [
        {
          value: '1',
          label: 'Founder Berpengalaman',
          color: 'text-green-darken-3'
        },
        {
          value: '100%',
          label: 'Open Source',
          color: 'text-blue-darken-2'
        },
        {
          value: '24/7',
          label: 'Community Support',
          color: 'text-orange-darken-2'
        }
      ],

      profileStats: [
        {
          value: '∞',
          label: 'Big Dreams'
        }
      ],

      projectLink: "https://github.com/alimasyhur/tahfeed-ui",
      contactLink: "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0ASaya%20tertarik%20untuk%20bergabung%20dengan%20tim%20tahfeed",
      sourceCodeLink: "https://github.com/alimasyhur/tahfeed-ui",
      contactUsLink: "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0AOrganisasi%20saya%20ingin%20bergabung%20bersama%20tahfeed.%20Bagaimana%20caranya%20ya%3F%0ATerimakasih"
    }
  }
}
</script>

<style scoped>
.teamview {
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

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 2rem);
  font-weight: 400;
  color: #616161;
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
.stat-card,
.profile-card {
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

/* Profile Avatar */
.profile-avatar {
  position: relative;
  display: inline-block;
}

.profile-avatar::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: linear-gradient(45deg, #4CAF50, #66bb6a, #81c784, #4CAF50);
  border-radius: 50%;
  animation: rotate 3s linear infinite;
  z-index: -1;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Contributors */
.contributor-chip {
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contributor-chip:hover {
  transform: translateY(-2px);
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