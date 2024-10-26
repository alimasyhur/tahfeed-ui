<template>
  <v-container>
    <v-row>
      <div>
        <v-breadcrumbs :items="breadcrumbsItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </v-row>

    <v-row v-if="(kelas !== undefined)">
      <v-col cols="12">
        <v-card-item>
          <v-card-title>
            <div>
              <v-icon icon="mdi-home-account" end></v-icon>
              Kelas {{ kelas.name }}
            </div>

          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>Description</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.description }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Org Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.org_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Grade</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.grade_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Grade Year</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.grade_period }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Teacher NIK</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.teacher_nik }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Teacher Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.teacher_firstname + ' ' + kelas.teacher_lastname }}
                  </th>
                </tr>
                <!-- <tr>
                  <th class="text-left">
                    <b>Status Verifikasi</b>
                  </th>
                  <th class="text-left">
                    <v-badge :color="organization.is_verified_label_color" :content="organization.is_verified_label"
                      inline></v-badge>
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Status Aktif</b>
                  </th>
                  <th class="text-left">
                    <v-badge :color="organization.is_active_label_color" :content="organization.is_active_label"
                      inline></v-badge>
                  </th>
                </tr> -->
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <h1>Kelas is not found</h1>
      </v-col>
    </v-row>

    <!-- <v-row v-if="(organization !== undefined)">
      <v-col cols="12">
        <v-card-item>
          <v-card-title>
            <div>
              <v-icon icon="mdi-account" end></v-icon>
              Users
            </div>

          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    <b>Email</b>
                  </th>
                  <th class="text-left">
                    <b>Role</b>
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
                <tr v-for="( user, idx ) in users" :key="idx">
                  <th class="text-left">{{ user.user_name }}</th>
                  <th class="text-left">{{ user.email }}</th>
                  <th class="text-left">{{ user.role_name }}</th>
                  <th class="text-left">
                    <v-badge :color="user.is_active_label_color" :content="user.is_active_label" inline></v-badge>
                  </th>
                  <th class="text-left">
                    <v-badge :color="user.is_confirmed_label_color" :content="user.is_confirmed_label" inline></v-badge>
                  </th>
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
import { useKelasStorage } from '@/stores/kelasStorage';
// import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';

export default {
  data: () => ({
    slug: null,
    breadcrumbsItems: [
      {
        title: 'Kelas',
        disabled: false,
        href: '/kelas',
      },
    ],
    kelas: {},
    users: [],
  }),
  methods: {
    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Kelas',
          disabled: false,
          to: { name: 'kelas' }
        },
        {
          title: this.$route.params.slug,
          disabled: true,
          href: `kelas/${this.$route.params.slug}`,
        }
      ]
    },

  },
  async mounted() {
    this.slug = this.$route.params.slug;
    this.getBreadcrumbs()

    const kelasStorage = useKelasStorage()
    const data = await kelasStorage.showKelasByUUID(this.slug)
    this.kelas = data.data

    // const params = {
    //   org_uuid: this.organization.uuid
    // }
    // const userOrgStorage = useUserOrganizationStorage()
    // const userOrgData = await userOrgStorage.getUserOrganizations(params)
    // this.users = userOrgData.data
  }
};
</script>