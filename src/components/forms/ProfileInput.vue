<template>
  <v-card title="Complete Your Profile">
    <v-card-text>
      <v-divider></v-divider>
      <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3" closable
        close-label="Close Alert"></v-alert>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="profile.firstname" :rules="[required]" label="Firstname" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="profile.lastname" :rules="[required]" label="Lastname" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="profile.birthdate" :rules="[required]" label="Birthdate" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="profile.phone" :rules="[required]" label="Phone" type="number" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="profile.bio" :rules="[required]" label="Bio" type="text" :loading="loading"
          clearable></v-text-field>

        <v-row>
          <v-col>
            <v-btn :disabled="!form" color="success" size="large" type="submit" variant="elevated" block>Save
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="warning" size="large" type="button" variant="elevated" block
              @click="closeDialogProfile">Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script setup>
import { ref, onMounted, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useUserStorage } from '@/stores/userStorage';

const userStorage = useUserStorage()

const { closeDialogProfile, addProfile, editProfile } = userStorage

const form = ref(false)

const { loading, hasAlert, alertMessage, alertType } = storeToRefs(userStorage)

const required = (v) => {
  return !!v || 'Field is required'
}

const props = defineProps({
  profile: {
    type: Object,
    default: reactive({
      uuid: null,
      firstname: null,
      lastname: null,
      birthdate: null,
      phone: null,
      bio: null,
    })
  }
})

const profile = props.profile

const onSubmit = () => {
  if (profile.uuid !== null) {
    editProfile(profile)
  } else {
    addProfile(profile)
  }
}

onMounted(() => {
  userStorage.dataUser()
})
</script>