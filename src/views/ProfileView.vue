<template>
  <v-dialog v-model="dialogProfile" width="auto" min-width="500" :dialog="dialogProfile" persistent>
    <ProfileInput :profile="profile" />
  </v-dialog>

  <v-dialog v-model="dialogOrganization" width="auto" min-width="500" :dialog="dialogOrganization" persistent>
    <OrganizationInput :organization="organization" />
  </v-dialog>

  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>My Profile</h1>
      </v-col>
    </v-row>

    <div v-if="me">
      <v-card class="my-8" max-width="1000">
        <v-card-item>
          <v-card-title>
            <v-icon icon="mdi-account" end></v-icon>
            Profile
            <v-btn v-if="(me.profile !== null)" small class="not-uppercase" flat @click="openEditProfile(me.profile)">
              <v-icon color="info">mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-else small class="not-uppercase" flat @click="openCreateProfile()">
              <v-icon color="info">mdi-plus</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact" v-if="(me.profile !== null)">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    {{ me.user.name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Email</b>
                  </th>
                  <th class="text-left">
                    {{ me.user.email }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Full Name</b>
                  </th>
                  <th class="text-left">
                    {{ me.profile.firstname }} {{ me.profile.lastname }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>Birthdate</b>
                  </th>
                  <th class="text-left">
                    {{ me.profile.birthdate }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Phone</b>
                  </th>
                  <th class="text-left">
                    {{ me.profile.phone }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Bio</b>
                  </th>
                  <th class="text-left">
                    {{ me.profile.bio }}
                  </th>
                </tr>
              </tbody>
            </v-table>
            <div v-else>
              <p>Anda belum memiliki profile. Lengkapi Profile Anda</p>
            </div>
          </v-card-subtitle>
        </v-card-item>

        <v-divider></v-divider>
        <v-card-item>
          <v-card-title>
            <v-row>
              <v-col cols="3">
                <v-icon icon="mdi-home-account" end></v-icon>
                My Organization
              </v-col>
              <v-col cols="9" v-if="isSuperAdminOrAdmin()">
                <v-btn v-if="(me.organization !== null)" small class="not-uppercase" flat
                  @click="openEditOrganization(me.organization)">
                  <v-icon color="info">mdi-pencil</v-icon>
                </v-btn>
                <v-btn v-else small class="not-uppercase" flat @click="openCreateOrganization()">
                  <v-icon color="info">mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>

          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact" v-if="(me.organization !== null)">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>Domain</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.domain }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Bio</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.bio }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Address</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.address }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Email</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.email }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Phone</b>
                  </th>
                  <th class="text-left">
                    {{ me.organization.phone }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Status Verifikasi</b>
                  </th>
                  <th class="text-left">
                    <v-badge :color="me.organization.is_verified_label_color"
                      :content="me.organization.is_verified_label" inline></v-badge>
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Status Aktif</b>
                  </th>
                  <th class="text-left">
                    <v-badge :color="me.organization.is_active_label_color" :content="me.organization.is_active_label"
                      inline></v-badge>
                  </th>
                </tr>
              </tbody>
            </v-table>
            <div v-else>
              <p>Anda belum memiliki organisasi. Buat Organisasi Anda!</p>
            </div>
          </v-card-subtitle>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-item>
          <v-card-title>
            <v-icon icon="mdi-cog-outline" end></v-icon>
            My Roles
          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Role</b>
                  </th>
                  <th class="text-left">
                    <b>Organization</b>
                  </th>
                  <th class="text-left">
                    <b>Status Aktif</b>
                  </th>
                  <th class="text-left">
                    <b>Status Konfirmasi</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="( role, idx ) in me.roles" :key="idx">
                  <th class="text-left">{{ role.role_name }}</th>
                  <th class="text-left">{{ role.org_name }}</th>
                  <th class="text-left">
                    <v-badge :color="role.is_active_label_color" :content="role.is_active_label" inline></v-badge>
                  </th>
                  <th class="text-left">
                    <v-badge :color="role.is_confirmed_label_color" :content="role.is_confirmed_label" inline></v-badge>
                  </th>
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>


        <v-divider></v-divider>

        <v-card-item>
          <v-card-title>
            <v-icon icon="mdi-cog-outline" end></v-icon>
            My Qur'an Templates
          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    <b>Description</b>
                  </th>
                  <th class="text-left">
                    <b>Organization</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="( quran, idx ) in me.qurans" :key="idx">
                  <th class="text-left">{{ quran.name }}</th>
                  <th class="text-left">{{ quran.description }}</th>
                  <th class="text-left">{{ quran.organization_name }}</th>
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>

        <v-card-text>
        </v-card-text>
      </v-card>

    </div>
  </v-container>
</template>

<script setup>
import ProfileInput from "@/components/forms/ProfileInput.vue"
import OrganizationInput from "@/components/forms/OrganizationInput.vue"
import { useUserStorage } from '@/stores/userStorage';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue';

const userStorage = useUserStorage()
const { me, dialogProfile } = storeToRefs(userStorage)
const { isSuperAdminOrAdmin } = userStorage

const organizationStorage = useOrganizationStorage()
const { dialogOrganization } = storeToRefs(organizationStorage)

const openEditProfile = (profileData) => {
  dialogProfile.value = true
  profile.value = profileData
}

const openCreateProfile = () => {
  dialogProfile.value = true
}

const openEditOrganization = (organizationData) => {
  dialogOrganization.value = true
  organization.value = organizationData
}

const openCreateOrganization = () => {
  dialogOrganization.value = true
}

const profile = ref({
  uuid: null,
  firstname: null,
  lastname: null,
  birthdate: null,
  phone: null,
  bio: null,
})

const organization = ref({
  uuid: null,
  name: null,
  domain: null,
  bio: null,
  address: null,
  email: null,
  phone: null,
})

if (me != null) {
  profile.value = me.profile
  organization.value = me.organization
}

onMounted(() => {
  userStorage.dataUser()
})
</script>
