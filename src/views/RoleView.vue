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
                <v-icon icon="mdi-shield-account" class="mr-3" color="primary"></v-icon>
                Role Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage user roles, permissions, and access control
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn color="primary" variant="elevated" size="large" @click="dialog = true" class="action-btn"
                prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Role</span>
                <span class="d-sm-none">New</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Statistics Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="8" lg="6">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search roles..." variant="outlined"
          clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="roles.length > 0" color="primary" variant="tonal" prepend-icon="mdi-shield-account">
          {{ totalItems }} Total Roles
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="roles" :items-length="totalItems" :loading="loading"
            v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'name', order: 'asc' }]"
            class="modern-table" :mobile-breakpoint="600">

            <!-- Role Name with Avatar -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.name)" size="32" class="mr-3">
                  <v-icon :icon="getRoleIcon(item.name)" color="white" size="18"></v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis">
                    Role permissions and access
                  </div>
                </div>
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <v-tooltip text="Edit Role" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Delete Role" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteItem(item)"
                      v-bind="props"></v-btn>
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
                <v-icon icon="mdi-shield-off-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Roles Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No roles match your search criteria.' : 'Get started by creating your first role.' }}
                </p>
                <v-btn v-if="!search" color="primary" variant="elevated" @click="dialog = true" prepend-icon="mdi-plus">
                  Create First Role
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Role Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-shield-plus' : 'mdi-pencil'" size="24" class="mr-3"
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
              <!-- Role Information Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-shield-account" class="mr-2"></v-icon>
                  Role Information
                </h3>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="editedItem.name" :rules="required" label="Role Name" variant="outlined"
                  prepend-inner-icon="mdi-shield-account" :loading="loading" clearable
                  placeholder="Enter role name (e.g., Administrator, User, Manager)"
                  hint="Choose a descriptive name for this role" persistent-hint></v-text-field>
              </v-col>

              <!-- Role Preview -->
              <v-col cols="12" v-if="editedItem.name">
                <v-card variant="tonal" color="info" class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar :color="getAvatarColor(editedItem.name)" size="40" class="mr-3">
                      <v-icon :icon="getRoleIcon(editedItem.name)" color="white" size="20"></v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-medium text-body-1">{{ editedItem.name }}</div>
                      <div class="text-caption text-medium-emphasis">Role preview</div>
                    </div>
                  </div>
                </v-card>
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
            {{ editedIndex === -1 ? 'Create Role' : 'Update Role' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500" persistent>
      <v-card class="modern-dialog delete-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-delete-alert" size="24" class="mr-3" color="error"></v-icon>
            <span class="text-h5 font-weight-bold">Confirm Deletion</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeDelete" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-alert-circle-outline" size="64" color="warning" class="mb-4"></v-icon>

            <h3 class="text-h6 mb-3">Are you sure?</h3>

            <p class="text-body-1 mb-4">
              You're about to delete the role
              <strong class="text-error">{{ editedItem.name }}</strong>.
              This action cannot be undone.
            </p>

            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">
                  Users assigned to this role may lose their permissions.
                </span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" size="large" :loading="loading" @click="deleteItemConfirm">
            Delete Role
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

.delete-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.05) 0%, rgba(var(--v-theme-warning), 0.02) 100%);
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
import { useRoleStorage } from '@/stores/roleStorage';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Role Name',
        align: 'start',
        key: 'name',
        width: '60%'
      },
      {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        width: '40%',
        align: 'center'
      },
    ],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Role Management',
        disabled: true,
        href: 'role',
      }
    ],
    roles: [],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
    search: '',
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    loading: false,
    alertMessage: 'An error occurred',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'This field is required'
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Role' : 'Edit Role'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.roles.filter(role =>
        Object.values(role).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    options: {
      handler() {
        // this.fetchData();
      },
      deep: true,
    },
  },

  methods: {
    // Helper methods for UI
    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];
      const index = name ? name.charCodeAt(0) % colors.length : 0;
      return colors[index];
    },

    getRoleIcon(roleName) {
      if (!roleName) return 'mdi-shield-account'

      const name = roleName.toLowerCase()
      if (name.includes('admin') || name.includes('super')) return 'mdi-shield-crown'
      if (name.includes('manager') || name.includes('lead')) return 'mdi-shield-star'
      if (name.includes('user') || name.includes('member')) return 'mdi-shield-account'
      if (name.includes('guest') || name.includes('visitor')) return 'mdi-shield-outline'
      if (name.includes('moderator') || name.includes('mod')) return 'mdi-shield-check'

      return 'mdi-shield-account'
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

      if (this.search !== "") {
        params.q = this.search;
      }

      const roleStorage = useRoleStorage()
      const data = await roleStorage.getRoles(params)

      this.roles = data.data
      this.totalItems = data.total
      this.loading = false
    },

    editItem(item) {
      this.editedIndex = this.roles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.roles.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.loading = true
      const roleStorage = useRoleStorage()
      const respDelete = await roleStorage.removeRole(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogDelete = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeDelete()
        }, 700)
      }
      this.loading = false
    },

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeDelete() {
      this.dialog = false
      this.dialogDelete = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      this.loading = true

      if (this.editedIndex > -1) {
        const roleStorage = useRoleStorage()
        const respEdited = await roleStorage.editRole(this.editedItem)

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
        const roleStorage = useRoleStorage()
        const respEdited = await roleStorage.addRole(this.editedItem)

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
  },

  async mounted() {
    // Initialize data on mount if needed
  }
}
</script>
