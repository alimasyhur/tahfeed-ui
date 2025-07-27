<template>
  <!-- Baru -->

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
                <v-icon icon="mdi-star" class="mr-3" color="primary"></v-icon>
                Grade Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage grade profiles, qualifications, and assignments
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn v-if="isSuperAdminOrAdminRole" color="primary" variant="elevated" size="large"
                @click="dialog = true" class="action-btn" prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Grade</span>
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
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search grades..." variant="outlined"
          clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="grades.length > 0" color="primary" variant="tonal" prepend-icon="mdi-account-group">
          {{ totalItems }} Total Grades
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="grades" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'firstname', order: 'asc' }]" class="modern-table" :mobile-breakpoint="600">
            <!-- Grade Name with Avatar -->
            <template v-slot:item.firstname="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.firstname + ' ' + item.lastname)" size="32" class="mr-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.firstname + ' ' + item.lastname) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.firstname }} {{ item.lastname }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    NIK: {{ item.nik }}
                  </div>
                </div>
              </div>
            </template>

            <!-- NIK with Icon -->
            <template v-slot:item.nik="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-card-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span class="font-mono">{{ item.nik }}</span>
              </div>
            </template>

            <!-- Birthdate with Icon -->
            <template v-slot:item.birthdate="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ formatDate(item.birthdate) }}</span>
                <v-chip v-if="getAge(item.birthdate)" color="info" variant="tonal" size="x-small" class="ml-2">
                  {{ getAge(item.birthdate) }} yrs
                </v-chip>
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
                <v-tooltip text="Edit Grade" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-if="isSuperAdminOrAdminRole" icon="mdi-pencil" size="small" variant="text" color="primary"
                      @click="editItem(item)" v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <v-tooltip text="Delete Grade" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-if="isSuperAdminOrAdminRole" icon="mdi-delete" size="small" variant="text" color="error"
                      @click="deleteItem(item)" v-bind="props"></v-btn>
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
                <v-icon icon="mdi-school-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Grades Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No grades match your search criteria.' : 'Get started by adding your first grade.' }}
                </p>
                <v-btn v-if="!search && isSuperAdminOrAdminRole" color="primary" variant="elevated"
                  @click="dialog = true" prepend-icon="mdi-plus">
                  Add First Grade
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Grade Dialog -->
    <v-dialog v-model="dialog" max-width="800" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-school-outline' : 'mdi-pencil'" size="24" class="mr-3"
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
              <!-- Personal Information Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-star" class="mr-2"></v-icon>
                  Grade Information
                </h3>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="editedItem.name" :rules="required" label="Name" variant="outlined"
                  prepend-inner-icon="mdi-card" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field v-model="editedItem.description" :rules="required" label="Description" variant="outlined"
                  prepend-inner-icon="mdi-text" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12">
                <VueDatePicker v-model="editedItem.period" :rules="required" placeholder="Select Angkatan" year-picker
                  :format="formattedYear">
                </VueDatePicker>
              </v-col>

              <!-- Account & Organization Section -->
              <v-row v-if="isSuperAdminRole">
                <v-col cols="12">
                  <v-divider class="my-4"></v-divider>
                  <h3 class="text-h6 mb-4 d-flex align-center">
                    <v-icon icon="mdi-cog" class="mr-2"></v-icon>
                    Account & Organization
                  </h3>
                </v-col>

                <v-col cols="12">
                  <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText"
                    item-value="value" label="Organization" variant="outlined"
                    prepend-inner-icon="mdi-domain"></v-select>
                </v-col>
              </v-row>
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
            {{ editedIndex === -1 ? 'Create Grade' : 'Update Grade' }}
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
              You're about to delete grade
              <strong class="text-error">{{ editedItem.firstname }} {{ editedItem.lastname }}</strong>.
              This action cannot be undone.
            </p>

            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">
                  All associated data and records will be permanently removed.
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
            Delete Grade
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

.font-mono {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.date-picker-container {
  position: relative;
}

.date-picker-container .v-label {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 8px;
  display: block;
}

.modern-date-picker {
  width: 100%;
}

.modern-date-picker :deep(.dp__input) {
  border: 1px solid rgba(var(--v-theme-outline), 0.38);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.modern-date-picker :deep(.dp__input:focus) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.12);
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

.v-theme--dark .modern-date-picker :deep(.dp__input) {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-color: rgba(var(--v-theme-outline), 0.38);
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
import { useGradeStorage } from '@/stores/gradeStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Grades Management',
        disabled: true,
        href: 'grade',
      }
    ],
    grades: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
    },
    defaultItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
    },
    search: '',
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    isSuperAdminRole: false,
    isSuperAdminOrAdminRole: false,
    orgOptions: [],
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
      return this.editedIndex === -1 ? 'New New Grade' : 'Edit Grade'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.grades.filter(grade =>
        Object.values(grade).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    formattedYear() {
      if (!this.editedItem.period) return ''

      const date = new Date(this.editedItem.period, 0, 1)
      const year = date.getFullYear()

      return `${year}`
    }
  },

  watch: {
    async dialog(val) {
      if (val) {
        this.orgOptions = await this.fetchOrganizationOptions()
        return val || this.close()
      } else {
        this.close()
      }
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

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    async fetchData() {
      this.loading = true;
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)
      const { isSuperAdmin, isSuperAdminOrAdmin } = userStorage
      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'name',
      };

      this.isSuperAdminRole = isSuperAdmin(activeRole.value)
      this.isSuperAdminOrAdminRole = isSuperAdminOrAdmin(activeRole.value)

      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
        }
      }

      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const gradeStorage = useGradeStorage()
      const data = await gradeStorage.getGrades(params)

      this.grades = data.data
      this.totalItems = data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'Name',
            align: 'start',
            key: 'name',
            width: '200px'
          },
          {
            title: 'Description',
            key: 'description',
            width: '200px'
          },
          {
            title: 'Period',
            key: 'period',
            width: '150px'
          },
          {
            title: 'Organization',
            key: 'org_name',
            width: '200px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
            align: 'center',
          },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'Name',
            align: 'start',
            key: 'name',
            width: '200px',
          },
          {
            title: 'Description',
            key: 'description',
            width: '200px',
          },
          {
            title: 'Period',
            key: 'period',
            width: '150px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
            align: 'center',
          },
        ]

        headers = headers.concat(adminHeader)
      }

      return headers
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

    editItem(item) {
      this.editedIndex = this.grades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.grades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      this.loading = true
      const gradeStorage = useGradeStorage()
      const respDelete = await gradeStorage.removeGrade(this.editedItem)

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
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      this.loading = true

      if (activeRole.value.constant_value === 2) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        const gradeStorage = useGradeStorage()
        const respEdited = await gradeStorage.editGrade(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          this.fetchData()
          setTimeout(() => {
            this.dialogDelete = false
            this.alertMessage = ''
            this.hasAlert = false
            this.alertType = ''
            this.editedIndex = -1
            this.editedItem = this.defaultItem
            this.close()
          }, 700)
        }
      } else {
        const gradeStorage = useGradeStorage()
        const respEdited = await gradeStorage.addGrade(this.editedItem)

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

  }
}
</script>