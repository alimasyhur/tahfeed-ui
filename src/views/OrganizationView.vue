<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12">
        <h1>Organization</h1>
      </v-col>
    </v-row> -->

    <v-row>
      <div>
        <v-breadcrumbs :items="breadcrumbsItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </v-row>

    <v-row>
      <v-data-table :headers="headers" :search="search" :items="organizations" :items-length="totalItems"
        :loading="loading" v-model:options="options" @update:options="fetchData"
        :sort-by="[{ key: 'name', order: 'asc' }]">
        <template v-slot:item.is_active="{ item }">
          <v-badge :color="item.is_active_label_color" :content="item.is_active_label">
            <template v-slot:badge>
              <span>{{ item.is_active_label }}</span>
            </template>
          </v-badge>
        </template>
        <template v-slot:item.is_verified="{ item }">
          <v-badge :color="item.is_verified_label_color" :content="item.is_verified_label">
            <template v-slot:badge>
              <span>{{ item.is_verified_label }}</span>
            </template>
          </v-badge>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List Organization</v-toolbar-title>
            <v-dialog v-model="dialog" width="auto" min-width="500" persistent>
              <template v-slot:activator="{ props }">
                <v-btn class="not-uppercase" color="primary" dark v-bind="props" variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New Organization
                </v-btn>
              </template>
              <v-card :title="formTitle">
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="save">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.name" :rules="required" label="Name" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.domain" :rules="required" label="Domain" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.bio" :rules="required" label="Bio" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.address" :rules="required" label="Address" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.email" :rules="required" label="Email" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.phone" :rules="required" label="Phone" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-select v-model="editedItem.is_verified" :items="statusVerifiedOptions"
                            item-title="displayText" item-value="value" label="Select status verification"></v-select>
                          <v-select v-model="editedItem.is_active" :items="statusActiveOptions" item-title="displayText"
                            item-value="value" label="Select status active"></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-btn color="success" size="large" type="submit" variant="elevated" :disabled="!form"
                            block>Save
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="warning" size="large" type="button" variant="elevated" block
                            @click="close">Cancel
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

              </v-card>
            </v-dialog>
            <v-divider class="mx-4" vertical></v-divider>
            <v-spacer></v-spacer>

            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
              hide-details></v-text-field>

          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon class="me-2" size="small" @click="detailOrganization(item.domain)">
            mdi-eye
          </v-icon>
        </template>
        <template v-slot:no-data>
          no data
        </template>
      </v-data-table>

    </v-row>
  </v-container>
</template>

<script>
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'name',
      },
      {
        title: 'Email',
        key: 'email',
      },
      {
        title: 'Phone',
        key: 'phone',
      },
      {
        title: 'Status Verifikasi',
        key: 'is_verified',
      },
      {
        title: 'Status Active',
        key: 'is_active',
      },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    statusVerifiedOptions: [
      { value: 0, displayText: 'not verified' },
      { value: 1, displayText: 'verified' },
      { value: 2, displayText: 'rejected' },
    ],
    statusActiveOptions: [
      { value: 0, displayText: 'not active' },
      { value: 1, displayText: 'active' },
    ],
    breadcrumbsItems: [
      {
        title: 'Organizations',
        disabled: true,
        href: 'organization',
      }
    ],
    organizations: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      domain: '',
      bio: '',
      address: '',
      email: '',
      phone: '',
      is_verified: '',
      is_active: '',
    },
    defaultItem: {
      name: '',
      domain: '',
      bio: '',
      address: '',
      email: '',
      phone: '',
      is_verified: '',
      is_active: '',
    },
    search: '',
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    loading: false,
    alertMessage: 'Terjadi Kesalahan',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'Field is required'
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Organization' : 'Edit Organization'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.organizations.filter(organization =>
        Object.values(organization).some(val =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  methods: {
    detailOrganization(slug) {
      this.$router.push({ path: `/organization/${slug}` });
    },

    async fetchData() {
      this.loading = true;

      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'name',
      };

      const orgStorage = useOrganizationStorage()
      const data = await orgStorage.getOrganizations(params)
      this.organizations = data.data

      this.totalItems = data.total
      this.loading = false
    },

    editItem(item) {
      this.editedIndex = this.organizations.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = this.defaultItem
    },

    async save() {
      if (this.editedIndex > -1) {
        this.loading = true
        const orgStorage = useOrganizationStorage()
        const respEdited = await orgStorage.editAdminOrganization(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          this.fetchData()
          setTimeout(() => {
            this.dialog = false
            this.alertMessage = ''
            this.hasAlert = false
            this.alertType = ''
            this.editedIndex = -1
            this.editedItem = this.defaultItem
            this.close()
          }, 700)
        }
      } else {
        this.loading = true
        const orgStorage = useOrganizationStorage()
        const respEdited = await orgStorage.addAdminOrganization(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          this.fetchData()
          setTimeout(() => {
            this.dialog = false
            this.alertMessage = ''
            this.hasAlert = false
            this.alertType = ''
            this.editedIndex = -1
            this.editedItem = this.defaultItem
            this.close()
          }, 500)
        }
      }
      this.loading = false
    },
  },
  async mounted() {
    this.fetchData()
  }
}
</script>