import '@/assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'
import router from './router'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const vuetify = createVuetify({
  components,
  directives
})

const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

app.use(pinia)
app.use(vuetify)
app.use(router)

app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
