<template>
  <v-card title="Update Organization">
    <v-card-text>
      <v-divider></v-divider>
      <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3" closable
        close-label="Close Alert"></v-alert>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="organization.name" :rules="[required]" label="Name" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="organization.domain" :rules="[required]" label="Domain" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="organization.bio" :rules="[required]" label="Bio" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="organization.address" :rules="[required]" label="Address" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="organization.email" :rules="[required]" label="Email" type="text" :loading="loading"
          clearable></v-text-field>

        <v-text-field v-model="organization.phone" :rules="[required]" label="Phone" type="text" :loading="loading"
          clearable></v-text-field>

        <v-row>
          <v-col>
            <v-btn :disabled="!form" color="success" size="large" type="submit" variant="elevated" block>Save
            </v-btn>
          </v-col>
          <v-col>
            <v-btn color="warning" size="large" type="button" variant="elevated" block
              @click="closeDialogOrganization">Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>


<script setup>
import { ref, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useOrganizationStorage } from '@/stores/organizationStorage';

const organizationStorage = useOrganizationStorage()

const { closeDialogOrganization, addOrganization, editOrganization } = organizationStorage

const form = ref(false)

const { loading, hasAlert, alertMessage, alertType } = storeToRefs(organizationStorage)

const required = (v) => {
  return !!v || 'Field is required'
}

const props = defineProps({
  organization: {
    type: Object,
    default: reactive({
      uuid: null,
      name: null,
      domain: null,
      bio: null,
      address: null,
      email: null,
      phone: null,
    })
  }
})

const organization = props.organization

const onSubmit = () => {
  if (organization.uuid != null) {
    editOrganization(organization)
  } else {
    addOrganization(organization)
  }
}

</script>