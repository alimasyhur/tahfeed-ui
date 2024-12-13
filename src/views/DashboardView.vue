<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Dashboard</h1>
      </v-col>
    </v-row>

    <div v-if="me">
      <v-card class="my-8" max-width="1000">
        <v-card-item>
          <v-card-title>
            <v-icon icon="mdi-account" end></v-icon>
            Profile
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
            <p v-else>Anda belum memiliki profile. Lengkapi profile Anda!</p>
          </v-card-subtitle>
        </v-card-item>

        <v-divider></v-divider>

        <v-card-item>
          <v-card-title>
            <v-icon icon="mdi-home-account" end></v-icon>
            My Organization
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
                    <b>Org Name</b>
                  </th>
                  <th class="text-left">
                    <b>Role Name</b>
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
                  <th class="text-left">{{ role.org_name }}</th>
                  <th class="text-left">{{ role.role_name }}</th>
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
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue';

const userStorage = useUserStorage()
const { me } = storeToRefs(userStorage)

onMounted(() => {
  userStorage.dataUser()
})
</script>
