<template>
  <v-container fluid class="pa-4">
    <!-- Header Section with Gradient Background -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-section">
          <v-breadcrumbs :items="breadcrumbsItems" class="pa-0 mb-4">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right" size="small"></v-icon>
            </template>
          </v-breadcrumbs>

          <div class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div class="page-title-section mb-4 mb-md-0">
              <h1 class="page-title text-h4 font-weight-bold mb-2">
                <v-icon icon="mdi-account-group" class="mr-3" color="primary"></v-icon>
                User Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage users, roles, and permissions across your organization
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn color="primary" variant="elevated" size="large" @click="dialog = true" class="action-btn"
                prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New User</span>
                <span class="d-sm-none">New</span>
              </v-btn>

              <v-btn color="success" variant="elevated" size="large" @click="assignRole" class="action-btn"
                prepend-icon="mdi-cog-outline">
                <span class="d-none d-sm-inline">Assign Role</span>
                <span class="d-sm-none">Assign</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filters Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="8" lg="6">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search users..." variant="outlined"
          clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="users.length > 0" color="primary" variant="tonal" prepend-icon="mdi-account-multiple">
          {{ totalItems }} Total Users
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="users" :items-length="totalItems" :loading="loading"
            v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'name', order: 'asc' }]"
            class="modern-table" :mobile-breakpoint="600">
            <!-- Status Badges -->
            <template v-slot:item.is_active="{ item }">
              <v-chip :color="item.is_active_label_color" variant="flat" size="small" class="font-weight-medium">
                {{ item.is_active_label }}
              </v-chip>
            </template>

            <template v-slot:item.is_confirmed="{ item }">
              <v-chip :color="item.is_confirmed_label_color" variant="flat" size="small" class="font-weight-medium">
                {{ item.is_confirmed_label }}
              </v-chip>
            </template>

            <!-- User Name with Avatar -->
            <template v-slot:item.user_name="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.user_name)" size="32" class="mr-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.user_name) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.user_name }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    {{ item.email }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Role with Icon -->
            <template v-slot:item.role_name="{ item }">
              <v-chip color="secondary" variant="tonal" size="small" prepend-icon="mdi-shield-account">
                {{ item.role_name }}
              </v-chip>
            </template>

            <!-- Organization -->
            <template v-slot:item.org_name="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                {{ item.org_name }}
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <v-tooltip text="Edit User" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Reset Password" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-lock-reset" size="small" variant="text" color="warning"
                      @click="resetPassword(item)" v-bind="props"></v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <!-- Loading State -->
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <!-- No Data State -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-account-off" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Users Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No users match your search criteria.' : 'Get started by adding your first user.' }}
                </p>
                <v-btn v-if="!search" color="primary" variant="elevated" @click="dialog = true" prepend-icon="mdi-plus">
                  Add First User
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern User Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-account-plus' : 'mdi-account-edit'" size="24" class="mr-3"
              color="primary"></v-icon>
            <span class="text-h5 font-weight-bold">{{ formTitle }}</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="close" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <v-form v-model="form" @submit.prevent="save">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.user_name" :rules="required" label="Full Name" variant="outlined"
                  prepend-inner-icon="mdi-account" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.email" :rules="required" label="Email Address" variant="outlined"
                  prepend-inner-icon="mdi-email" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col v-if="editedIndex === -1" cols="12">
                <v-text-field v-model="editedItem.password" :rules="required" label="Password" type="password"
                  variant="outlined" prepend-inner-icon="mdi-lock" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.role_uuid" :items="rolesOptions" item-title="displayText"
                  item-value="value" label="Role" variant="outlined" prepend-inner-icon="mdi-shield-account"></v-select>
              </v-col>

              <v-col v-if="isSuperAdminRole" cols="12" md="6">
                <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText" item-value="value"
                  label="Organization" variant="outlined" prepend-inner-icon="mdi-domain"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.is_confirmed" :items="statusConfirmationOptions" item-title="displayText"
                  item-value="value" label="Confirmation Status" variant="outlined"
                  prepend-inner-icon="mdi-check-circle"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.is_active" :items="statusActiveOptions" item-title="displayText"
                  item-value="value" label="Active Status" variant="outlined" prepend-inner-icon="mdi-power"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="close">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" size="large" :disabled="!form" :loading="loading" @click="save">
            {{ editedIndex === -1 ? 'Create User' : 'Update User' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reset Password Dialog -->
    <v-dialog v-model="dialogResetPassword" max-width="500" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-lock-reset" size="24" class="mr-3" color="warning"></v-icon>
            <span class="text-h5 font-weight-bold">Reset Password</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeResetPassword" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <v-form v-model="form" @submit.prevent="saveResetPassword">
            <v-text-field v-model="editedItem.new_password" :rules="required" label="New Password" type="password"
              variant="outlined" prepend-inner-icon="mdi-lock" :loading="loading" clearable></v-text-field>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeResetPassword">
            Cancel
          </v-btn>
          <v-btn color="warning" variant="elevated" size="large" :disabled="!form" :loading="loading"
            @click="saveResetPassword">
            Reset Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Role Dialog -->
    <v-dialog v-model="dialogAssignRole" max-width="600" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-cog-outline" size="24" class="mr-3" color="success"></v-icon>
            <span class="text-h5 font-weight-bold">Assign Role</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeAssignRole" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <v-form v-model="form" @submit.prevent="saveAssignRole">
            <v-row>
              <v-col cols="12">
                <v-select v-model="editedItem.user_uuid" :items="userOptions" item-title="displayText"
                  item-value="value" label="Select User" variant="outlined" prepend-inner-icon="mdi-account"></v-select>
              </v-col>

              <v-col cols="12">
                <v-select v-model="editedItem.role_uuid" :items="rolesOptions" item-title="displayText"
                  item-value="value" label="Select Role" variant="outlined"
                  prepend-inner-icon="mdi-shield-account"></v-select>
              </v-col>

              <v-col v-if="isSuperAdminRole" cols="12">
                <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText" item-value="value"
                  label="Select Organization" variant="outlined" prepend-inner-icon="mdi-domain"></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeAssignRole">
            Cancel
          </v-btn>
          <v-btn color="success" variant="elevated" size="large" :disabled="!form" :loading="loading"
            @click="saveAssignRole">
            Assign Role
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 8px;
}

.page-title {
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.page-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
}

.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.search-field {
  border-radius: 12px;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-table-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.modern-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
}

.modern-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.modern-table :deep(.v-data-table__tr:hover) {
  background: rgba(var(--v-theme-primary), 0.02);
}

.action-buttons-cell {
  display: flex;
  gap: 4px;
}

.modern-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.modern-dialog :deep(.v-field) {
  border-radius: 12px;
}

.modern-dialog :deep(.v-btn) {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .action-buttons {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }

  .modern-dialog {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
}

/* Dark mode adjustments */
.v-theme--dark .data-table-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

/* Custom scrollbar */
:deep(.v-data-table__wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 4px;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>

<script>
import { useUserStorage } from '@/stores/userStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';
import { useRoleStorage } from '@/stores/roleStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
  data: () => ({
    dialog: false,
    dialogResetPassword: false,
    dialogAssignRole: false,
    headers: [],
    statusConfirmationOptions: [
      { value: 0, displayText: 'Not Confirmed' },
      { value: 1, displayText: 'Confirmed' },
      { value: 2, displayText: 'Rejected' },
    ],
    statusActiveOptions: [
      { value: 0, displayText: 'Inactive' },
      { value: 1, displayText: 'Active' },
    ],
    rolesOptions: [],
    orgOptions: [],
    userOptions: [],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'User Management',
        disabled: true,
        href: 'user',
      }
    ],
    users: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      user_uuid: '',
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
      user_uuid: '',
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
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    isSuperAdminRole: false,
    loading: false,
    alertMessage: 'An error occurred',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'This field is required'
    ],
    params: {},
    activeRole: {},
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Create New User' : 'Edit User'
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
    dialogResetPassword(val) {
      val || this.close()
    },
    dialogAssignRole(val) {
      val || this.close()
    },
  },

  methods: {
    // Helper methods for UI
    getInitials(name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    },

    async fetchData() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      this.loading = true;

      if (activeRole.value.constant_value === 1) {
        this.isSuperAdminRole = true
      }

      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'name',
      };

      if (activeRole.value.role_name === 'Admin') {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
          role_name: activeRole.value.role_name,
          constant_value: activeRole.value.constant_value,
        }
      }

      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const userOrgStorage = useUserOrganizationStorage()
      const data = await userOrgStorage.getUserOrganizations(params)

      this.users = data.data
      this.totalItems = data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'User',
            align: 'start',
            key: 'user_name',
            width: '200px'
          },
          {
            title: 'Email',
            key: 'email',
            width: '200px'
          },
          {
            title: 'Role',
            key: 'role_name',
            width: '120px'
          },
          {
            title: 'Organization',
            key: 'org_name',
            width: '160px'
          },
          {
            title: 'Active Status',
            key: 'is_active',
            width: '120px'
          },
          {
            title: 'Confirmation',
            key: 'is_confirmed',
            width: '120px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
            align: 'center'
          },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'User',
            align: 'start',
            key: 'user_name',
            width: '200px'
          },
          {
            title: 'Email',
            key: 'email',
            width: '200px'
          },
          {
            title: 'Role',
            key: 'role_name',
            width: '120px'
          },
          {
            title: 'Active Status',
            key: 'is_active',
            width: '120px'
          },
          {
            title: 'Confirmation',
            key: 'is_confirmed',
            width: '120px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
            align: 'center'
          },
        ]

        headers = headers.concat(adminHeader)
      }

      return headers
    },

    async fetchUserOrganizationOptions() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)
      const userOrgStorage = useUserOrganizationStorage()

      const params = {}
      if (activeRole.value.role_name === 'Admin') {
        params.org_uuid = activeRole.value.org_uuid
      }

      const userOptionsData = await userOrgStorage.getUserOrganizationOptions(params)
      const userOptions = userOptionsData.data.map(user => {
        return {
          ...user,
          value: user.uuid,
          displayText: `${user.email} (${user.name})`
        }
      })

      return userOptions
    },

    async fetchOrganizationOptions() {
      const orgStorage = useOrganizationStorage()
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.constant_value === 2) {
        return [{
          value: activeRole.value.org_uuid,
          displayText: activeRole.value.org_name,
        }]
      }

      const orgOptionsData = await orgStorage.getOrganizations()
      const orgOptions = orgOptionsData.data.map(org => {
        return {
          ...org,
          value: org.uuid,
          displayText: org.name,
        }
      })

      return orgOptions
    },

    async fetchRoleOptions() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      this.loading = true;
      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'name',
      };

      if (activeRole.value.role_name === 'Admin') {
        params.org_uuid = activeRole.value.org_uuid
        params.role_name = activeRole.value.role_name
      }

      if (this.search !== "") {
        params.q = this.search;
      }

      const roleStorage = useRoleStorage()
      const data = await roleStorage.getRoles(params)
      const rolesData = data.data
      const rolesOptions = rolesData.map(role => {
        return {
          ...role,
          value: role.uuid,
          displayText: role.name,
        }
      })

      return rolesOptions
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    resetPassword(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogResetPassword = true
    },

    assignRole() {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.dialog = false
      this.dialogAssignRole = true
    },

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeResetPassword() {
      this.dialogResetPassword = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeAssignRole() {
      this.dialogAssignRole = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      this.loading = true

      if (activeRole.value.constant_value === 2) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        this.loading = true

        const userOrgStorage = useUserOrganizationStorage()
        const respEdited = await userOrgStorage.editAdminUserOrganization(this.editedItem)

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
            this.editedItem = Object.assign({}, this.defaultItem)
            this.close()
          }, 700)
        }
      } else {
        this.loading = true

        const userOrgStorage = useUserOrganizationStorage()
        const respEdited = await userOrgStorage.addAdminUserOrganization(this.editedItem)

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
            this.editedItem = Object.assign({}, this.defaultItem)
            this.close()
          }, 500)
        }
      }
      this.loading = false
    },

    async saveResetPassword() {
      this.loading = true

      const userStorage = useUserStorage()
      const respEdited = await userStorage.adminResetPassword(this.editedItem)

      this.alertMessage = respEdited.message
      this.hasAlert = true
      this.alertType = respEdited.status

      if (respEdited.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogResetPassword = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.close()
        }, 700)
      }

      this.loading = false
    },

    async saveAssignRole() {
      this.loading = true

      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.role_name === 'Admin') {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      const userOrgStorage = useUserOrganizationStorage()
      const respEdited = await userOrgStorage.adminAssignUserRoleOrganization(this.editedItem)

      this.alertMessage = respEdited.message
      this.hasAlert = true
      this.alertType = respEdited.status

      if (respEdited.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogAssignRole = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.close()
        }, 700)
      }

      this.loading = false
    },

  },

  async mounted() {
    this.rolesOptions = await this.fetchRoleOptions()
    this.userOptions = await this.fetchUserOrganizationOptions()
    this.orgOptions = await this.fetchOrganizationOptions()
  }
}
</script>