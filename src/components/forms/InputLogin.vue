<template>
  <div class="text-h4 text-center my-5">
    Login
  </div>
  <v-divider></v-divider>
  <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3" closable
    close-label="Close Alert"></v-alert>
  <v-form v-model="form" @submit.prevent="onSubmit">

    <v-text-field v-model="user.email" :rules="[required]" label="Email" type="email" :loading="loading"></v-text-field>

    <v-text-field v-model="user.password" :rules="[required]" label="Password" type="password" :loading="loading"
      placeholder="Enter your password"></v-text-field>

    <br>
    <v-row>
      <v-col>
        <v-btn :disabled="!form" color="success" size="large" type="submit" variant="elevated" block>
          Sign In
        </v-btn>
      </v-col>
      <v-col>
        <v-btn color="warning" size="large" type="button" variant="elevated" block @click="closeDialog">Cancel
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

const user = reactive({
  name: null,
  email: null,
  password: null,
})

const { loading, hasAlert, alertMessage, alertType, me, activeRole, selectedRole } = storeToRefs(userStorage)

const onSubmit = () => {
  loginUser(user).then(() => {
    const myRoleList = me?.value?.roles
    const changedRole = myRoleList[selectedRole.value]

    activeRole.value = changedRole

    const listMenu = getMenu(changedRole)

    const newData = {
      activeRole: changedRole,
      listMenu,
      myRoleList
    }

    eventBus.emit('dataUpdated', newData);
  })
}

const required = (v) => {
  return !!v || 'Field is required'
}

</script>