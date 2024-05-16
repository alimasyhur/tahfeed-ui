<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12">
        <h1>User</h1>
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
      <v-data-table :headers="headers" :search="search" :items="filteredItems"
        :sort-by="[{ key: 'name', order: 'asc' }]">
        <template v-slot:item.is_active="{ item }">
          <v-badge :color="item.is_active_label_color" :content="item.is_active_label">
            <template v-slot:badge>
              <span>{{ item.is_active_label }}</span>
            </template>
          </v-badge>
        </template>
        <template v-slot:item.is_confirmed="{ item }">
          <v-badge :color="item.is_confirmed_label_color" :content="item.is_confirmed_label">
            <template v-slot:badge>
              <span>{{ item.is_confirmed_label }}</span>
            </template>
          </v-badge>
        </template>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List User</v-toolbar-title>
            <v-dialog v-model="dialog" width="auto" min-width="500" persistent>
              <template v-slot:activator="{ props }">
                <v-btn class="not-uppercase mr-2" color="primary" dark v-bind="props" variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New User
                </v-btn>
                <v-btn class="not-uppercase" color="success" dark v-bind="props" variant="flat" size="small">
                  <v-icon>mdi-cog-outline</v-icon> Assign Role
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
                          <v-text-field v-model="editedItem.user_name" :rules="required" label="Name" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-model="editedItem.email" :rules="required" label="Email" type="text"
                            :loading="loading" clearable></v-text-field>
                          <v-text-field v-if="editedIndex === -1" v-model="editedItem.password" :rules="required"
                            label="Password" type="password" :loading="loading" clearable></v-text-field>
                          <v-select v-model="editedItem.role_uuid" :items="rolesOptions" item-title="displayText"
                            item-value="value" label="Select Role"></v-select>
                          <v-select v-model="editedItem.is_confirmed" :items="statusConfirmationOptions"
                            item-title="displayText" item-value="value" label="Select status confirmation"></v-select>
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
        </template>
        <template v-slot:no-data>
          no data
        </template>
      </v-data-table>

    </v-row>
  </v-container>
</template>

<script>
import { useUserStorage } from '@/stores/userStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';
import { useRoleStorage } from '@/stores/roleStorage';
import { storeToRefs } from 'pinia';

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        title: 'Name',
        align: 'start',
        key: 'user_name',
      },
      {
        title: 'Email',
        key: 'email',
      },
      {
        title: 'Role',
        key: 'role_name',
      },
      {
        title: 'Organization',
        key: 'org_name',
      },
      {
        title: 'Status Aktif',
        key: 'is_active',
      },
      {
        title: 'Status Konfirmasi',
        key: 'is_confirmed',
      },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    statusConfirmationOptions: [
      { value: 0, displayText: 'not confirmed' },
      { value: 1, displayText: 'confirmed' },
      { value: 2, displayText: 'rejected' },
    ],
    statusActiveOptions: [
      { value: 0, displayText: 'not active' },
      { value: 1, displayText: 'active' },
    ],
    rolesOptions: [],
    breadcrumbsItems: [
      {
        title: 'Users',
        disabled: true,
        href: 'user',
      }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      user_name: '',
      email: '',
      role_uuid: '',
      role_name: '',
      org_uuid: '',
      org_name: '',
      is_active: '',
      is_confirmed: '',
    },
    defaultItem: {
      uuid: '',
      user_name: '',
      email: '',
      role_uuid: '',
      role_name: '',
      org_uuid: '',
      org_name: '',
      is_active: '',
      is_confirmed: '',
    },
    search: '',
    loading: false,
    alertMessage: 'Terjadi Kesalahan',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'Field is required'
    ],
    params: {},
    activeRole: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.users.filter(user =>
        Object.values(user).some(val =>
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

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const userStorage = useUserStorage()
      const data = await userStorage.getUsers()
      this.users = data.data
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
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

        const userOrgStorage = useUserOrganizationStorage()
        const respEdited = await userOrgStorage.editAdminUserOrganization(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          const data = await userOrgStorage.getUserOrganizations(this.params)
          this.users = data.data
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
        this.editedItem.org_uuid = this.activeRole.org_uuid;
        this.loading = true

        const userOrgStorage = useUserOrganizationStorage()
        const respEdited = await userOrgStorage.editAdminUserOrganization(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          const data = await userStorage.getUsers()
          this.users = data.data
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
    const userStorage = useUserStorage()
    const { activeRole } = storeToRefs(userStorage)

    if (activeRole.value.role_name === 'Admin') {
      this.params = {
        org_uuid: activeRole.value.org_uuid,
        role_name: activeRole.value.role_name,
      }
      this.activeRole = activeRole
    }

    const userOrgStorage = useUserOrganizationStorage()
    const userOrgData = await userOrgStorage.getUserOrganizations(this.params)
    this.users = userOrgData.data

    const roleStorage = useRoleStorage()
    const data = await roleStorage.getRoles(this.params)
    const rolesData = data.data
    const rolesOptions = rolesData.map(role => {
      return {
        ...role,
        value: role.uuid,
        displayText: role.name,
      }
    })

    this.rolesOptions = rolesOptions
  }
}
</script>