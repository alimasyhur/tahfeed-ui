<template>
  <div>
    <!-- Hero Section -->
    <v-container fluid class="py-12 bg-white">
      <v-row align="center" justify="center" class="pa-4" no-gutters>
        <v-col cols="12" md="7">
          <div class="text-h4 text-md-h3 mb-4 text-green-darken-4">
            <b>tah</b><b class="text-green-lighten-1">feed</b> - Feed Your Iman with Memorizing Qur'an
          </div>
          <p class="text-body-1 text-green-darken-6">
            Platform Digital untuk monitoring Hafalan Al-Qur'an kita. Tingkatkan Produktifitas Anda dengan Automasi dan
            Tracking Progress Hafalan Qur'an Anda. <br />
            <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> Trackable, Manageable,
            Transparant, and More Awesome Features.
          </p>
        </v-col>

        <v-col cols="12" md="5" class="text-center mt-8 mt-md-0">
          <v-img src="/images/landing/tahfeed-semangat-hafal.png" max-width="400" class="mx-auto rounded-image" />
        </v-col>
      </v-row>
    </v-container>

    <!-- Carousel Section -->
    <v-container fluid class="px-0">
      <v-carousel height="400" progress="primary" hide-delimiters>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-row class="fill-height pa-4" align="center" justify="center">
            <v-col cols="12" md="6" :order="i % 2 === 0 ? 1 : 2">
              <v-img :src="slide.src" max-width="300" class="mx-auto rounded-image" />
            </v-col>
            <v-col cols="12" md="6" :order="i % 2 === 0 ? 2 : 1">
              <div class="text-h6 text-md-h4 text-center text-md-left">
                {{ slide.text }}
              </div>
            </v-col>
          </v-row>
        </v-carousel-item>
      </v-carousel>
    </v-container>

    <!-- Features Section -->
    <v-container fluid class="bg-white py-12">
      <div class="text-h5 text-md-h3 text-center mb-10 px-4">
        <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is the solution to the issues
        surrounding tahfidz reports and activities
      </div>

      <v-row class="px-4" justify="center" align="stretch" dense>
        <v-col cols="12" sm="6" md="4" class="mb-6" v-for="(feature, idx) in features" :key="idx">
          <v-sheet class="pa-6 text-center" elevation="2">
            <v-icon :icon="feature.icon" size="48" class="mb-4 text-green-darken-4" />
            <div class="text-h6 mb-2">{{ feature.title }}</div>
            <div class="text-body-2">{{ feature.description }}</div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call To Action -->
    <v-container class="text-center py-12">
      <div class="text-h5 text-md-h3 mb-6">
        <b class="text-green-darken-4">tah</b><b class="text-green-lighten-1">feed</b> is a free service!
      </div>
      <div class="mb-6">
        Open-source MIT Licensed.
      </div>
      <v-btn color="info" prepend-icon="mdi-github" :href="sourceCodeLink" target="_blank" class="mx-2">
        Source Code
      </v-btn>
      <v-btn color="success" prepend-icon="mdi-whatsapp" :href="contactUsLink" target="_blank" class="mx-2">
        Contact Us
      </v-btn>
    </v-container>
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
      features: [
        {
          icon: 'mdi-devices',
          title: 'Easy to Access',
          description: 'Access from anywhere as long as there is internet.'
        },
        {
          icon: 'mdi-clock-fast',
          title: 'Simple',
          description: 'No need taking much time to create monthly reports.'
        },
        {
          icon: 'mdi-eye-outline',
          title: 'Transparent',
          description: 'All history is recorded properly for managers or student guardians to track.'
        },
        {
          icon: 'mdi-lock-outline',
          title: 'Secure',
          description: "All data is only accessible to the organization's admin."
        },
        {
          icon: 'mdi-clipboard-file-outline',
          title: 'Flexible',
          description: 'Can be used for various Tahfidz activities.'
        },
        {
          icon: 'mdi-book-clock-outline',
          title: 'Scheduling Exam',
          description: 'Exam schedules and achievements can be announced and trackable.'
        }
      ],
      sourceCodeLink: "https://github.com/alimasyhur/tahfeed-ui",
      contactUsLink:
        "https://api.whatsapp.com/send?phone=628156558085&text=Assalamu%27alaikum%0AOrganisasi%20saya%20ingin%20bergabung%20bersama%20tahfeed.%20Bagaimana%20caranya%20ya%3F%0ATerimakasih",
    }
  },
}
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
