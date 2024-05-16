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

    <v-row v-if="(organization !== undefined)">
      <v-col cols="12">
        <v-card-item>
          <v-card-title>
            <div>
              <v-icon icon="mdi-home-account" end></v-icon>
              Organization {{ organization.name }}
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
                    {{ organization.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>Domain</b>
                  </th>
                  <th class="text-left">
                    {{ organization.domain }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Bio</b>
                  </th>
                  <th class="text-left">
                    {{ organization.bio }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Address</b>
                  </th>
                  <th class="text-left">
                    {{ organization.address }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Email</b>
                  </th>
                  <th class="text-left">
                    {{ organization.email }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Phone</b>
                  </th>
                  <th class="text-left">
                    {{ organization.phone }}
                  </th>
                </tr>
                <tr>
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
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <h1>Organization is not found</h1>
      </v-col>
    </v-row>

    <v-row v-if="(organization !== undefined)">
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
    </v-row>
  </v-container>
</template>

<script>
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';

export default {
  data: () => ({
    slug: null,
    breadcrumbsItems: [
      {
        title: 'Organizations',
        disabled: false,
        href: '/organization',
      },
    ],
    organization: {},
    users: [],
  }),
  methods: {
    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Organizations',
          disabled: false,
          to: { name: 'organization' }
        },
        {
          title: this.$route.params.slug,
          disabled: true,
          href: `organization/${this.$route.params.slug}`,
        }
      ]
    },

  },
  async mounted() {
    this.slug = this.$route.params.slug;
    this.getBreadcrumbs()

    const orgStorage = useOrganizationStorage()
    const data = await orgStorage.showOrganizationByDomain(this.slug)
    this.organization = data.data

    const params = {
      org_uuid: this.organization.uuid
    }
    const userOrgStorage = useUserOrganizationStorage()
    const userOrgData = await userOrgStorage.getUserOrganizations(params)
    this.users = userOrgData.data
  }
};
</script>