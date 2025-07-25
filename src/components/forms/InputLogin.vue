<template>
  <div class="text-h5 text-center my-4">Login</div>

  <v-divider></v-divider>

  <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3" closable
    close-label="Close Alert" />

  <v-form v-model="form" @submit.prevent="onSubmit" class="pa-2">
    <v-text-field autocomplete="off" v-model="email" :rules="[required]" label="Email" type="email"
      :loading="loading"></v-text-field>

    <v-text-field autocomplete="off" v-model="password" :rules="[required]" label="Password" type="password"
      :loading="loading" placeholder="Enter your password"></v-text-field>

    <v-row dense class="mt-4">
      <v-col cols="12" sm="6">
        <v-btn :disabled="!form" color="success" size="large" type="submit" variant="elevated" block>
          Sign In
        </v-btn>
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn color="warning" size="large" type="button" variant="elevated" block @click="closeDialog">
          Cancel
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>


<script setup>
import { ref, reactive } from "vue";
import { useUserStorage } from "@/stores/userStorage";
import { storeToRefs } from "pinia";
import eventBus from "@/stores/eventBus"

const userStorage = useUserStorage()

const { loginUser, closeDialog, getMenu } = userStorage

const form = ref(false)

const loading = ref(false);
const email = ref('')
const password = ref('')

const { hasAlert, alertMessage, alertType, me, activeRole, selectedRole } = storeToRefs(userStorage)

const onSubmit = async () => {
  loading.value = true
  try {
    await loginUser({ email: email.value, password: password.value })

    const myRoleList = me?.value?.roles || []
    const changedRole = myRoleList[selectedRole.value]
    activeRole.value = changedRole
    const listMenu = getMenu(changedRole)

    eventBus.emit('dataUpdated', {
      activeRole: changedRole,
      listMenu,
      myRoleList
    })
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const required = (v) => {
  return !!v || 'Field is required'
}

</script>