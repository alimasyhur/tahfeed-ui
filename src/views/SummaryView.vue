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
                <v-icon icon="mdi-chart-line" class="mr-3" color="primary"></v-icon>
                Summary Report
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Track student achievements and progress overview
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn color="primary" variant="elevated" size="large" @click="dialog = true" class="action-btn"
                prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Report</span>
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
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search achievements..."
          variant="outlined" clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="achievements.length > 0" color="primary" variant="tonal" prepend-icon="mdi-trophy">
          {{ totalItems }} Total Records
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="achievements" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'fullname', order: 'asc' }]" class="modern-table" :mobile-breakpoint="600">

            <!-- Student Name with Avatar -->
            <template v-slot:item.fullname="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.fullname)" size="32" class="mr-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.fullname) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.fullname }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    NIS: {{ item.nis }}
                  </div>
                </div>
              </div>
            </template>

            <!-- NIS with Icon -->
            <template v-slot:item.nis="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-card-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span class="font-mono">{{ item.nis }}</span>
              </div>
            </template>

            <!-- Progress Chips for Week Data -->
            <template v-slot:item.z_total_pekan_lalu="{ item }">
              <v-chip color="info" variant="tonal" size="small" prepend-icon="mdi-book-open">
                {{ item.z_total_pekan_lalu || 0 }}
              </v-chip>
            </template>

            <template v-slot:item.m_total_pekan_lalu="{ item }">
              <v-chip color="warning" variant="tonal" size="small" prepend-icon="mdi-repeat">
                {{ item.m_total_pekan_lalu || 0 }}
              </v-chip>
            </template>

            <template v-slot:item.z_total_pekan_ini="{ item }">
              <v-chip color="success" variant="tonal" size="small" prepend-icon="mdi-book-open">
                {{ item.z_total_pekan_ini || 0 }}
              </v-chip>
            </template>

            <template v-slot:item.m_total_pekan_ini="{ item }">
              <v-chip color="orange" variant="tonal" size="small" prepend-icon="mdi-repeat">
                {{ item.m_total_pekan_ini || 0 }}
              </v-chip>
            </template>

            <!-- Total Hafalan with Progress -->
            <template v-slot:item.total="{ item }">
              <div class="d-flex align-center">
                <!-- <v-progress-circular :model-value="getTotalProgress(item.total)" :size="30" :width="3" color="primary"
                  class="mr-2">
                  <span class="text-caption">{{ item.total }}</span>
                </v-progress-circular> -->
                <!-- <span class="font-weight-medium">{{ item.total }}</span> -->
                <v-chip color="black" variant="tonal" size="small" prepend-icon="mdi-book">
                  {{ item.total }}
                </v-chip>
              </div>
            </template>

            <!-- Grade with Icon -->
            <template v-slot:item.grade_name="{ item }">
              <div class="d-flex align-center">
                <v-chip color="primary" variant="tonal" size="small">
                  <v-icon icon="mdi-school" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                  {{ item.grade_name }}
                </v-chip>
              </div>
            </template>

            <!-- Organization -->
            <template v-slot:item.organization_name="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                {{ item.organization_name }}
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <v-tooltip text="View Details" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-eye" size="small" variant="text" color="primary" @click="detailSummary(item.uuid)"
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
                <v-icon icon="mdi-chart-line-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Achievement Data Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No records match your search criteria.' : 'Get started by adding your first report.' }}
                </p>
                <v-btn v-if="!search" color="primary" variant="elevated" @click="dialog = true" prepend-icon="mdi-plus">
                  Add First Report
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Report Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-chart-line-outline' : 'mdi-pencil'" size="24" class="mr-3"
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
              <!-- Basic Information Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-information" class="mr-2"></v-icon>
                  Report Information
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <div class="date-picker-container">
                  <label class="v-label">Date Input</label>
                  <VueDatePicker v-model="editedItem.date_input" :rules="required" placeholder="Select Date"
                    :enable-time-picker="false" :format="formattedDate" class="modern-date-picker" />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.student_uuid" :items="studentOptions" item-title="displayText"
                  item-value="value" label="Select Student" variant="outlined" prepend-inner-icon="mdi-account-school"
                  clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.type_report" :items="typeOptions" item-title="displayText"
                  item-value="value" label="Report Type" variant="outlined" prepend-inner-icon="mdi-file-document"
                  clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea v-model="editedItem.note" :rules="required" label="Notes" variant="outlined"
                  prepend-inner-icon="mdi-note-text" :loading="loading" rows="3" clearable></v-textarea>
              </v-col>

              <!-- Juz Selection Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-book-open" class="mr-2"></v-icon>
                  Quran Range Selection
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedStartJuz" :items="juzOptions" item-title="displayText" item-value="value"
                  label="Start Juz" @change="onJuzChange" variant="outlined" prepend-inner-icon="mdi-book"
                  clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedStartPage" :items="pageOptions" item-title="displayText" item-value="value"
                  label="Start Page" :disabled="!selectedStartJuz" variant="outlined"
                  prepend-inner-icon="mdi-book-open-page-variant" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedEndJuz" :items="juzOptions" item-title="displayText" item-value="value"
                  label="End Juz" :disabled="!selectedStartPage" @change="onJuzEndChange" variant="outlined"
                  prepend-inner-icon="mdi-book" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedEndPage" :items="pageOptions" item-title="displayText" item-value="value"
                  label="End Page" :disabled="!selectedEndJuz" variant="outlined"
                  prepend-inner-icon="mdi-book-open-page-variant" clearable></v-select>
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
            {{ editedIndex === -1 ? 'Create Report' : 'Update Report' }}
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
import { useSummaryStorage } from '@/stores/summaryStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';

export default {
  data: () => ({
    // Juz and selection data
    juzOptions: [],
    juzPageOptions: [],
    studentOptions: [],
    selectedStartJuz: null,
    selectedStartPage: null,
    selectedEndJuz: null,
    selectedEndPage: null,
    typeOptions: [],

    dialog: false,
    dialogDelete: false,
    dialogLock: false,
    dialogUnlock: false,
    dialogEnd: false,
    dialogReactivate: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Summary Report',
        disabled: true,
        href: 'summary',
      }
    ],
    achievements: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      student_uuid: '',
      org_uuid: '',
      kelas_uuid: '',
      teacher_uuid: '',
      start_juz_uuid: '',
      start_page_uuid: '',
      end_juz_uuid: '',
      end_page_uuid: '',
      name: '',
      description: '',
      note: '',
      date_input: null,
      type_report: '',
      is_locked: '',
      locked_at: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_nis: '',
      student_firstname: '',
      student_lastname: '',
      start_juz_page_name: '',
      end_juz_page_name: '',
      total: '',
      pekan_ini_label: '',
      total_pekan_ini: '',
      pekan_lalu_label: '',
      total_pekan_lalu: '',
    },
    defaultItem: {
      uuid: '',
      student_uuid: '',
      org_uuid: '',
      kelas_uuid: '',
      teacher_uuid: '',
      start_juz_uuid: '',
      start_page_uuid: '',
      end_juz_uuid: '',
      end_page_uuid: '',
      name: '',
      description: '',
      note: '',
      date_input: null,
      type_report: '',
      is_locked: '',
      locked_at: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_nis: '',
      student_firstname: '',
      student_lastname: '',
      start_juz_page_name: '',
      end_juz_page_name: '',
      total: '',
      pekan_ini_label: '',
      total_pekan_ini: '',
      pekan_lalu_label: '',
      total_pekan_lalu: '',
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
    gradeOptions: [],
    teacherOptions: [],
    loading: false,
    alertMessage: 'An error occurred',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'This field is required'
    ],
    activeRole: null,
    pageOptions: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Create New Report' : 'Edit Report'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.achievements.filter(achievement =>
        Object.values(achievement).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    formattedDate() {
      if (!this.editedItem.date_input) return ''
      const date = new Date(this.editedItem.date_input)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },

  watch: {
    async dialog(val) {
      if (val) {
        // Load options when dialog opens
        // this.orgOptions = await this.fetchOrganizationOptions()
        // this.gradeOptions = await this.fetchGradeOptions()
        // this.teacherOptions = await this.fetchTeacherOptions()
        // this.juzOptions = await this.fetchJuzOptions()
        // this.pageOptions = await this.fetchPageOptions()
        // this.studentOptions = await this.fetchKelasStudentOptions()
        // this.typeOptions = await this.fetchReportTypeOptions()
      } else {
        this.close()
      }
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dialogLock(val) {
      val || this.closeLock()
    },
    dialogUnlock(val) {
      val || this.closeUnlock()
    },
    dialogReactivate(val) {
      val || this.closeReactivate()
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

    getTotalProgress(total) {
      // Calculate progress based on total (assuming max is 30 juz)
      const maxJuz = 30;
      return Math.min((parseInt(total) || 0) / maxJuz * 100, 100);
    },

    detailSummary(slug) {
      this.$router.push({ path: `/summary/${slug}` });
    },

    onJuzChange() {
      this.selectedStartPage = null;
    },

    onJuzEndChange() {
      this.selectedEndPage = null;
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
        sortOrder: '1',
        sortField: 'name',
      };

      this.isSuperAdminRole = isSuperAdmin(activeRole.value)
      this.isSuperAdminOrAdminRole = isSuperAdminOrAdmin(activeRole.value)

      if (activeRole.value.constant_value === 2) {
        const query = {
          org_uuid: activeRole.value.org_uuid
        }
        params.filter = query
      }

      if (activeRole.value.constant_value === 3) {
        const query = {
          org_uuid: activeRole.value.org_uuid,
          teacher_uuid: activeRole.value.teacher_uuid,
        }
        params.filter = query
      }

      this.activeRole = activeRole.value

      if (this.search !== "") {
        params.q = this.search;
      }

      const summaryStorage = useSummaryStorage()
      const data = await summaryStorage.getAchievement(params)

      this.achievements = data.data
      this.totalItems = data.data.total
      this.loading = false

      this.headers = this.getHeaders(activeRole.value.constant_value)
    },

    getHeaders(activeRole) {
      let headers = [];

      // Check if achievements have data for dynamic headers
      const hasData = this.achievements.length > 0;
      const pekanLaluLabel = hasData ? this.achievements[0].pekan_lalu_label : 'Last Week';
      const pekanIniLabel = hasData ? this.achievements[0].pekan_ini_label : 'This Week';

      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'Student',
            align: 'start',
            key: 'fullname',
            width: '200px'
          },
          {
            title: 'NIS',
            key: 'nis',
            width: '120px'
          },
          {
            title: `${pekanLaluLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_lalu', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_lalu', width: '100px' },
            ],
          },
          {
            title: `${pekanIniLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_ini', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_ini', width: '100px' },
            ],
          },
          {
            title: 'Total',
            class: 'font-weight-bold',
            key: 'total',
            width: '120px'
          },
          {
            title: 'Grade',
            key: 'grade_name',
            width: '120px'
          },
          {
            title: 'Organization',
            key: 'organization_name',
            width: '160px'
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
            title: 'Student',
            align: 'start',
            key: 'fullname',
            width: '200px'
          },
          {
            title: 'NIS',
            key: 'nis',
            width: '120px'
          },
          {
            title: `${pekanLaluLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_lalu', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_lalu', width: '100px' },
            ],
          },
          {
            title: `${pekanIniLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_ini', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_ini', width: '100px' },
            ],
          },
          {
            title: 'Total',
            class: 'font-weight-bold',
            key: 'total',
            width: '120px'
          },
          {
            title: 'Grade',
            key: 'grade_name',
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

      if (activeRole === 3) {
        const teacherHeader = [
          {
            title: 'Student',
            align: 'start',
            key: 'fullname',
            width: '200px'
          },
          {
            title: 'NIS',
            key: 'nis',
            width: '120px'
          },
          {
            title: `${pekanLaluLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_lalu', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_lalu', width: '100px' },
            ],
          },
          {
            title: `${pekanIniLabel}`,
            class: 'font-weight-bold',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_ini', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_ini', width: '100px' },
            ],
          },
          {
            title: 'Total',
            class: 'font-weight-bold',
            key: 'total',
            width: '120px'
          },
          {
            title: 'Grade',
            key: 'grade_name',
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
        headers = headers.concat(teacherHeader)
      }

      return headers
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
      this.dialogDelete = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeLock() {
      this.dialogLock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeUnlock() {
      this.dialogUnlock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeReactivate() {
      this.dialogReactivate = false
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

      if (activeRole.value.constant_value === 3) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
        this.editedItem.teacher_uuid = activeRole.value.teacher_uuid;
      }

      // Set Juz and Page UUIDs
      this.editedItem.start_juz_uuid = this.selectedStartJuz;
      this.editedItem.start_page_uuid = this.selectedStartPage;
      this.editedItem.end_juz_uuid = this.selectedEndJuz;
      this.editedItem.end_page_uuid = this.selectedEndPage;

      if (this.editedIndex > -1) {
        // Update existing report
        const summaryStorage = useSummaryStorage()
        const respEdited = await summaryStorage.editReport(this.editedItem)

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
        // Create new report
        const summaryStorage = useSummaryStorage()
        const respEdited = await summaryStorage.addReport(this.editedItem)

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
    // Initial data loading
    await this.fetchData()
  }
}
</script>