<template>
  <v-container fluid class="pa-4">
    <!-- Header Section with Breadcrumbs -->
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
                <v-icon icon="mdi-account-school" class="mr-3" color="primary"></v-icon>
                {{ student?.firstname || 'Student Details' }} {{ student?.lastname || '' }}
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Student information and learning progress reports
              </p>
            </div>

            <!-- Status Badge -->
            <div class="status-section" v-if="student">
              <v-chip color="primary" variant="elevated" size="large" prepend-icon="mdi-account-check"
                class="font-weight-medium status-chip">
                Active Student
              </v-chip>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Student Information Section -->
    <v-row v-if="student && Object.keys(student).length > 0" class="mb-6">
      <!-- Personal Information Card -->
      <v-col cols="12" lg="8">
        <v-card class="info-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-details" size="24" class="mr-3" color="primary"></v-icon>
              <span class="text-h6 font-weight-bold">Personal Information</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-card-account-details" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">NIK</span>
                  </div>
                  <div class="info-value text-h6 font-weight-medium">{{ student.nik || 'Not Set' }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-school" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">NIS</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.nis || 'Not Set' }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-account" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">FULL NAME</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.firstname }} {{ student.lastname }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-calendar" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">BIRTHDATE</span>
                  </div>
                  <div class="info-value text-body-1">{{ formatDate(student.birthdate) }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-phone" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">PHONE</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.phone || 'Not Set' }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-domain" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">ORGANIZATION</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.organization_name || 'Not Set' }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-school-outline" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">GRADE</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.grade_name || 'Not Set' }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-text-account" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">BIO</span>
                  </div>
                  <div class="info-value text-body-1">{{ student.bio || 'No bio available' }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-book-open-page-variant" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">TOTAL HAFALAN</span>
                  </div>
                  <div class="info-value text-h6 font-weight-medium text-primary">{{ student.total || '0' }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Progress Summary Card -->
      <v-col cols="12" lg="4">
        <v-card class="progress-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-chart-line" size="24" class="mr-3" color="secondary"></v-icon>
              <span class="text-h6 font-weight-bold">Learning Progress</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Last Week Stats -->
            <div class="progress-section mb-6">
              <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                <v-icon icon="mdi-calendar-week" class="mr-2" color="warning"></v-icon>
                {{ student.pekan_lalu_label || 'Last Week' }}
              </h4>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Ziyadah:</span>
                <v-chip color="info" variant="tonal" size="large">
                  <b>{{ student.z_total_pekan_lalu || '0' }}</b>
                </v-chip>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-2">Murojaah:</span>
                <v-chip color="info" variant="tonal" size="large">
                  <b>{{ student.m_total_pekan_lalu || '0' }}</b>
                </v-chip>
              </div>
            </div>

            <!-- This Week Stats -->
            <div class="progress-section">
              <h4 class="text-subtitle-1 font-weight-bold mb-3 d-flex align-center">
                <v-icon icon="mdi-calendar-today" class="mr-2" color="success"></v-icon>
                {{ student.pekan_ini_label || 'This Week' }}
              </h4>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">Ziyadah:</span>
                <v-chip color="purple" variant="tonal" size="large">
                  <b>{{ student.z_total_pekan_ini || '0' }}</b>
                </v-chip>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-2">Murojaah:</span>
                <v-chip color="purple" variant="tonal" size="large">
                  <b>{{ student.m_total_pekan_ini || '0' }}</b>
                </v-chip>
              </div>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Total Progress -->
            <div class="text-center">
              <div class="text-h4 font-weight-bold text-primary mb-1"><b>{{ student.total || '0' }}</b></div>
              <div class="text-caption text-large-emphasis"><b>Total Hafalan</b></div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- Chart Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="chart-card" elevation="4">
          <v-card-title class="chart-header d-flex align-center">
            <v-icon icon="mdi-chart-line" class="mr-3" color="primary"></v-icon>
            <span class="text-h6 font-weight-bold">Setoran Trends</span>
            <v-spacer></v-spacer>
            <v-chip color="success" variant="tonal">
              {{ totalSetoran }} Total Setoran
            </v-chip>
          </v-card-title>

          <v-card-text>
            <div ref="chartContainer" class="chart-container">
              <canvas ref="setoranChart"></canvas>
            </div>
          </v-card-text>

          <!-- Chart Statistics -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card color="primary" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ totalSetoran }}</div>
                    <div class="text-subtitle-1">Total Setoran</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="success" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ dailyGrowth }}%</div>
                    <div class="text-subtitle-1">Daily Growth</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="warning" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ avgSetoran }}</div>
                    <div class="text-subtitle-1">Avg. All</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="chart-card" elevation="4">
          <v-card-title class="chart-header d-flex align-center">
            <v-icon icon="mdi-chart-line" class="mr-3" color="primary"></v-icon>
            <span class="text-h6 font-weight-bold">Report Trends</span>
            <v-spacer></v-spacer>
            <v-chip color="success" variant="tonal">
              {{ totalReports }} Total Reports
            </v-chip>
          </v-card-title>

          <v-card-text>
            <div ref="chartContainer" class="chart-container">
              <canvas ref="reportChart"></canvas>
            </div>
          </v-card-text>

          <!-- Chart Statistics -->
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card color="primary" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ totalReports }}</div>
                    <div class="text-subtitle-1">Total Reports</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="success" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ weeklyGrowth }}%</div>
                    <div class="text-subtitle-1">Weekly Growth</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card color="warning" dark>
                  <v-card-text class="text-center">
                    <div class="text-h5">{{ avgReportsPerWeek }}</div>
                    <div class="text-subtitle-1">Avg. Per Week</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Reports Section -->
    <v-row v-if="student && Object.keys(student).length > 0">
      <v-col cols="12">
        <v-card class="reports-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex flex-column flex-md-row align-center justify-space-between w-100">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-icon icon="mdi-file-document-multiple" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h6 font-weight-bold">Learning Reports</span>
                <v-chip v-if="reports.length > 0" color="primary" variant="tonal" class="ml-3">
                  {{ totalItems }} Total
                </v-chip>
              </div>

              <div class="search-section">
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search reports..."
                  variant="outlined" clearable hide-details class="search-field" density="comfortable"
                  style="min-width: 250px;">
                </v-text-field>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-data-table-server :headers="headers" :search="search" :items="reports" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            v-model:items-per-page="itemsPerPage" :sort-by="[{ key: 'date_input', order: 'desc' }]" class="modern-table"
            :mobile-breakpoint="600">

            <!-- Date Column -->
            <template v-slot:item.date_input="{ item }">
              <div>
                <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ formatDate(item.date_input) }}</span>
              </div>
            </template>

            <!-- Type Column -->
            <template v-slot:item.type_report="{ item }">
              <v-chip :color="getTypeColor(item.type_report)" variant="tonal" size="small"
                :prepend-icon="getTypeIcon(item.type_report)">
                {{ formatType(item.type_report) }}
              </v-chip>
            </template>

            <!-- Start Page Column -->
            <template v-slot:item.start_juz_page_name="{ item }">
              <div>
                <v-icon icon="mdi-book-open" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.start_juz_page_name || 'Not Set' }}</span>
              </div>
            </template>

            <!-- End Page Column -->
            <template v-slot:item.end_juz_page_name="{ item }">
              <div>
                <v-icon icon="mdi-book-open-variant" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.end_juz_page_name || 'Not Set' }}</span>
              </div>
            </template>

            <!-- Total Column -->
            <template v-slot:item.total="{ item }">
              <v-chip color="primary" variant="tonal" size="large">
                <b>{{ item.total || '0' }}</b>
              </v-chip>
            </template>

            <!-- Organization Column (for super admin) -->
            <template v-slot:item.org_uuid="{ item }">
              <div>
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.organization_name || 'Not Set' }}</span>
              </div>
            </template>

            <!-- Loading State -->
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
            </template>

            <!-- No Data State -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-file-document-multiple" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Reports Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No reports match your search criteria.' : 'This student doesn\'t have any reports yet.'
                  }}
                </p>
              </div>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>

    <!-- Student Not Found State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="text-center pa-8" elevation="4">
          <v-icon icon="mdi-alert-circle" size="80" color="error" class="mb-4"></v-icon>
          <h2 class="text-h4 mb-4">Student Not Found</h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            The student you're looking for doesn't exist or has been removed.
          </p>
          <v-btn color="primary" variant="elevated" to="/summary" prepend-icon="mdi-arrow-left">
            Back to Summary
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
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

.status-chip {
  border-radius: 12px;
  font-size: 0.875rem;
  height: 40px;
}

.info-card,
.progress-card,
.reports-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.info-item {
  padding: 8px 0;
}

.info-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: rgb(var(--v-theme-on-surface));
}

.progress-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.progress-section {
  background: rgba(var(--v-theme-surface-variant), 0.05);
  border-radius: 12px;
  padding: 16px;
}

.search-field {
  border-radius: 12px;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .info-card .pa-6 {
    padding: 16px !important;
  }
}

/* Dark mode adjustments */
.v-theme--dark .info-card,
.v-theme--dark .progress-card,
.v-theme--dark .reports-card {
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

.chart-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.v-theme--dark .chart-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.chart-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  padding: 16px 24px;
}

.v-theme--dark .chart-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>

<script>
import Chart from 'chart.js/auto';
import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
import { useReportStorage } from '@/stores/reportStorage';
import { storeToRefs } from 'pinia';
import moment from 'moment';

export default {
  data: () => ({
    slug: null,
    breadcrumbsItems: [
      {
        title: 'Summary',
        disabled: false,
        href: '/summary',
      },
    ],
    student: {},
    users: [],
    dialog: false,
    dialogDelete: false,
    headers: [],
    students: [],
    search: '',
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    reports: [],
    isSuperAdminRole: false,
    isSuperAdminOrAdminRole: false,
    orgOptions: [],
    userOptions: [],
    studentOptions: [],
    loading: false,
    alertMessage: 'Terjadi Kesalahan',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => !!v || 'Field is required'
    ],
    activeRole: null,
    chart: null,
    chartSecond: null,
    reportSummary: [],
    setoranSummary: [],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Student' : 'Edit Student'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.students.filter(student =>
        Object.values(student).some(val =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    // Chart computed properties
    totalReports() {
      return this.reportSummary.reduce((sum, item) => sum + item.reports, 0);
    },
    weeklyGrowth() {
      if (this.reportSummary.length < 2) return 0;
      const recent = this.reportSummary[this.reportSummary.length - 1].reports;
      const previous = this.reportSummary[this.reportSummary.length - 2].reports;
      return previous > 0 ? Math.round(((recent - previous) / previous) * 100) : 0;
    },
    avgReportsPerWeek() {
      if (this.reportSummary.length === 0) return 0;
      const total = this.reportSummary.reduce((sum, item) => sum + item.reports, 0);
      return Math.round(total / this.reportSummary.length);
    },
    totalSetoran() {
      return this.setoranSummary.reduce((sum, item) => Number(sum) + Number(item.jumlah_halaman), 0);
    },
    dailyGrowth() {
      if (this.setoranSummary.length < 2) return 0;
      const recent = this.setoranSummary[this.setoranSummary.length - 1].jumlah_halaman;
      const previous = this.setoranSummary[this.setoranSummary.length - 2].jumlah_halaman;
      return Number(previous) > 0 ? Math.round(((Number(recent) - Number(previous)) / Number(previous)) * 100) : 0;
    },
    avgSetoran() {
      if (this.setoranSummary.length === 0) return 0;
      const total = this.setoranSummary.reduce((sum, item) => Number(sum) + Number(item.jumlah_halaman), 0);
      return Math.round(Number(total) / this.setoranSummary.length);
    },
  },

  watch: {
    async dialog(val) {
      return val || this.close()
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
    formatDate(date) {
      if (!date) return 'Not Set';
      return moment(date).format('DD MMM YYYY');
    },

    getTypeColor(type) {
      const colors = {
        'ziyadah': 'success',
        'murojaah': 'warning',
        'review': 'info'
      };
      return colors[type] || 'grey';
    },

    getTypeIcon(type) {
      const icons = {
        'ziyadah': 'mdi-plus-circle',
        'murojaah': 'mdi-refresh',
        'review': 'mdi-eye'
      };
      return icons[type] || 'mdi-help';
    },

    formatType(type) {
      const typeMap = {
        'ziyadah': 'Ziyadah',
        'murojaah': 'Murojaah',
        'review': 'Review'
      };
      return typeMap[type] || type;
    },

    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Summary',
          disabled: false,
          to: { name: 'summary' }
        },
        {
          title: `${this.student?.firstname || ''} ${this.student?.lastname || ''}`.trim() || this.$route.params.slug,
          disabled: true,
          href: `summary/${this.$route.params.slug}`,
        }
      ]
    },

    getHeaders(activeRole) {
      let headers = [];
      const baseHeaders = [
        {
          title: 'Date',
          key: 'date_input',
          width: '130px'
        },
        {
          title: 'Type',
          key: 'type_report',
          width: '120px'
        },
        {
          title: 'Start Page',
          key: 'start_juz_page_name',
          width: '150px'
        },
        {
          title: 'End Page',
          key: 'end_juz_page_name',
          width: '150px'
        },
        {
          title: 'Total',
          key: 'total',
          width: '100px'
        },
        {
          title: 'Keterangan',
          key: 'note',
          width: '100px'
        },
      ];

      headers = [...baseHeaders];

      if (activeRole === 1) {
        headers.push({
          title: 'Organization',
          key: 'org_uuid',
          width: '200px'
        });
      }

      return headers;
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
        sortOrder: '-1',
        sortField: 'date_input',
      };

      this.isSuperAdminRole = isSuperAdmin(activeRole.value)
      this.isSuperAdminOrAdminRole = isSuperAdminOrAdmin(activeRole.value)

      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
        }
      }

      this.activeRole = activeRole.value

      if (this.search !== "") {
        params.q = this.search;
      }

      params.filter = {
        ...params.filter,
        student_uuid: this.$route.params.slug,
      }

      this.headers = this.getHeaders(activeRole.value.constant_value)

      const reportStorage = useReportStorage()
      const data = await reportStorage.getReports(params)

      this.reports = data.data
      this.totalItems = Number(data.total)
      this.loading = false
    },

    close() {
      this.dialog = false
    },

    closeDelete() {
      this.dialogDelete = false
    },

    async createChart() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const params = {
        sortOrder: '1',
        sortField: 'is_locked',
      };

      // summary start
      params.filter = {
        org_uuid: activeRole.value.org_uuid,
        student_uuid: this.$route.params.slug,
      }

      this.activeRole = activeRole.value
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const reportStorage = useReportStorage()
      const data = await reportStorage.getReportSummary(params)

      const reportSummary = data.data
      this.reportSummary = reportSummary
      // summary end


      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.reportChart.getContext('2d');

      // Prepare chart data from mock data
      const labels = this.reportSummary.map(item => {
        const startDate = new Date(item.week_start);
        const endDate = new Date(item.week_end);

        const dateLabel = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        return dateLabel;
      });
      const mappedData = reportSummary.map(item => item.reports);

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Reports Submitted',
            data: mappedData,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Report Submission Trends',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Reports'
              },
              grid: {
                color: 'rgba(0,0,0,0.1)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              },
              grid: {
                color: 'rgba(0,0,0,0.1)'
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    },

    async createSetoranChart() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const params = {
        sortOrder: '1',
        sortField: 'is_locked',
      };

      params.filter = {
        org_uuid: activeRole.value.org_uuid,
        student_uuid: this.$route.params.slug,
      }

      this.activeRole = activeRole.value
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const reportStorage = useReportStorage()
      const data = await reportStorage.getSetoranSummary(params)

      const setoranSummary = data.data
      this.setoranSummary = setoranSummary
      // summary end


      if (this.chartSecond) {
        this.chartSecond.destroy();
      }

      const ctx = this.$refs.setoranChart.getContext('2d');

      // Prepare chart data from mock data
      const labels = this.setoranSummary.map(item => {
        const date = new Date(item.date);

        const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return dateLabel;
      });
      const mappedData = setoranSummary.map(item => item.jumlah_halaman);

      this.chartSecond = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Jumlah Halaman',
            data: mappedData,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4CAF50',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Setoran Trends',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Jumlah Halaman'
              },
              grid: {
                color: 'rgba(0,0,0,0.1)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Date'
              },
              grid: {
                color: 'rgba(0,0,0,0.1)'
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    },
  },

  async mounted() {
    this.slug = this.$route.params.slug;

    this.createChart();
    this.createSetoranChart();

    const studentStorage = useStudentStorage()
    try {
      const data = await studentStorage.showStudentByUUID(this.slug)
      this.student = data.data.student;
      this.getBreadcrumbs()
      // Fetch reports after student data is loaded
      this.fetchData()
    } catch (error) {
      console.error('Failed to load student:', error)
      this.student = {}
    }
  },

  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }

    if (this.chartSecond) {
      this.chartSecond.destroy();
    }
  }
};
</script>