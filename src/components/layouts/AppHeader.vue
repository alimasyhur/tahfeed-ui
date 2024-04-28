<template>
  <v-app-bar color="white" flat>
    <v-app-bar-title :to="{ name: 'home' }">
      <b>tah</b><b style="color: green;">feed</b>
    </v-app-bar-title>

    <v-spacer></v-spacer>
    <v-btn :to="{ name: 'home' }" class="not-uppercase" v-if="(userStorage.currentUser == null)">Home</v-btn>
    <v-btn :to="{ name: 'dashboard' }" class="not-uppercase" v-if="userStorage.currentUser">Dashboard</v-btn>
    <v-btn target="#" class="not-uppercase ml-2" @click="openLogin()"
      v-if="(userStorage.currentUser == null)">Login</v-btn>
  </v-app-bar>

  <v-dialog v-model="dialog" width="auto" :dialog="dialog" persistent>
    <v-card class="mx-auto px-4 py-4" width="500" rounded="lg">

      <v-card-text>

        <InputLogin />

      </v-card-text>
    </v-card>

  </v-dialog>
</template>


<script setup>
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia'

import InputLogin from '../forms/InputLogin.vue';

const userStorage = useUserStorage()

const { dialog } = storeToRefs(userStorage)

const openLogin = () => {
  dialog.value = true
}
</script>
