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
                <v-icon icon="mdi-domain" class="mr-3" color="primary"></v-icon>
                Organization Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage organizations, verification status, and settings
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn color="primary" variant="elevated" size="large" @click="dialog = true" class="action-btn"
                prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Organization</span>
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
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search organizations..."
          variant="outlined" clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="organizations.length > 0" color="primary" variant="tonal" prepend-icon="mdi-domain">
          {{ totalItems }} Total Organizations
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="organizations" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'name', order: 'asc' }]" class="modern-table" :mobile-breakpoint="600">

            <!-- Organization Name with Avatar -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.name)" size="32" class="mr-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.name) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    {{ item.domain }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Domain with Icon -->
            <template v-slot:item.domain="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-web" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span class="font-mono">{{ item.domain }}</span>
              </div>
            </template>

            <!-- Email with Icon -->
            <template v-slot:item.email="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <a :href="`mailto:${item.email}`" class="text-decoration-none">
                  {{ item.email }}
                </a>
              </div>
            </template>

            <!-- Phone with Icon -->
            <template v-slot:item.phone="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <a :href="`tel:${item.phone}`" class="text-decoration-none">
                  {{ item.phone }}
                </a>
              </div>
            </template>

            <!-- Verification Status -->
            <template v-slot:item.is_verified="{ item }">
              <v-chip :color="item.is_verified_label_color" variant="tonal" size="small"
                :prepend-icon="getVerificationIcon(item.is_verified)">
                {{ item.is_verified_label }}
              </v-chip>
            </template>

            <!-- Active Status -->
            <template v-slot:item.is_active="{ item }">
              <v-chip :color="item.is_active_label_color" variant="tonal" size="small"
                :prepend-icon="getActiveIcon(item.is_active)">
                {{ item.is_active_label }}
              </v-chip>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <v-tooltip text="Edit Organization" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="View Details" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-eye" size="small" variant="text" color="info"
                      @click="detailOrganization(item.domain)" v-bind="props"></v-btn>
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
                <v-icon icon="mdi-domain-off" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Organizations Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No organizations match your search criteria.' :
                    'Get started by adding your first organization.' }}
                </p>
                <v-btn v-if="!search" color="primary" variant="elevated" @click="dialog = true" prepend-icon="mdi-plus">
                  Add First Organization
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Organization Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-domain-plus' : 'mdi-pencil'" size="24" class="mr-3"
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
              <!-- Organization Information Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-domain" class="mr-2"></v-icon>
                  Organization Information
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" :rules="required" label="Organization Name" variant="outlined"
                  prepend-inner-icon="mdi-domain" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.domain" :rules="required" label="Domain" variant="outlined"
                  prepend-inner-icon="mdi-web" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="editedItem.bio" :rules="required" label="Bio/Description" variant="outlined"
                  prepend-inner-icon="mdi-text" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="editedItem.address" :rules="required" label="Address" variant="outlined"
                  prepend-inner-icon="mdi-map-marker" :loading="loading" clearable></v-text-field>
              </v-col>

              <!-- Contact Information Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-contacts" class="mr-2"></v-icon>
                  Contact Information
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.email" :rules="required" label="Email Address" variant="outlined"
                  prepend-inner-icon="mdi-email" :loading="loading" clearable type="email"></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.phone" :rules="required" label="Phone Number" variant="outlined"
                  prepend-inner-icon="mdi-phone" :loading="loading" clearable type="tel"></v-text-field>
              </v-col>

              <!-- Status Configuration Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-cog" class="mr-2"></v-icon>
                  Status Configuration
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.is_verified" :items="statusVerifiedOptions" item-title="displayText"
                  item-value="value" label="Verification Status" variant="outlined"
                  prepend-inner-icon="mdi-shield-check"></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.is_active" :items="statusActiveOptions" item-title="displayText"
                  item-value="value" label="Active Status" variant="outlined"
                  prepend-inner-icon="mdi-toggle-switch"></v-select>
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
            {{ editedIndex === -1 ? 'Create Organization' : 'Update Organization' }}
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

.font-mono {
  font-family: 'Courier New', monospace;
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
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        title: 'Organization',
        align: 'start',
        key: 'name',
        width: '250px'
      },
      {
        title: 'Domain',
        key: 'domain',
        width: '200px',
        class: 'd-none d-md-table-cell'
      },
      {
        title: 'Email',
        key: 'email',
        width: '200px'
      },
      {
        title: 'Phone',
        key: 'phone',
        width: '150px',
        class: 'd-none d-lg-table-cell'
      },
      {
        title: 'Verification',
        key: 'is_verified',
        width: '130px'
      },
      {
        title: 'Status',
        key: 'is_active',
        width: '120px'
      },
      {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        width: '100px',
        align: 'center'
      },
    ],
    statusVerifiedOptions: [
      { value: 0, displayText: 'Not Verified' },
      { value: 1, displayText: 'Verified' },
      { value: 2, displayText: 'Rejected' },
    ],
    statusActiveOptions: [
      { value: 0, displayText: 'Inactive' },
      { value: 1, displayText: 'Active' },
    ],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
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
      return this.editedIndex === -1 ? 'New Organization' : 'Edit Organization'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.organizations.filter(organization =>
        Object.values(organization).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
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
    getInitials(name) {
      if (!name) return ''
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];
      const index = name ? name.charCodeAt(0) % colors.length : 0;
      return colors[index];
    },

    getVerificationIcon(status) {
      switch (status) {
        case 0: return 'mdi-clock-outline'
        case 1: return 'mdi-check-circle'
        case 2: return 'mdi-close-circle'
        default: return 'mdi-help-circle'
      }
    },

    getActiveIcon(status) {
      return status === 1 ? 'mdi-check-circle' : 'mdi-pause-circle'
    },

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

      if (this.search !== "") {
        params.q = this.search;
      }

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
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      this.loading = true

      if (this.editedIndex > -1) {
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
            this.editedItem = Object.assign({}, this.defaultItem)
            this.close()
          }, 700)
        }
      } else {
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
