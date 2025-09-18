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
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Bar Chart Section for Memorization Achievements -->
    <!-- <v-row class="mb-6">
      <v-col cols="12">
        <v-card class="chart-card" elevation="4">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-chart-bar" class="mr-2" color="primary"></v-icon>
            Capaian Total Hafalan Santri (0-30 Juz)
          </v-card-title>
          <v-card-text>
            <div ref="chartContainer" class="chart-container">
              <canvas ref="memorizationChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->

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

    <!-- Search and Statistics Section -->
    <v-row v-if="String(activeRole?.constant_value) !== String(4)" class="mb-4">
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
              <div>
                <div class="font-weight-medium">{{ item.fullname }}</div>
              </div>
            </template>

            <!-- NIS with Icon -->
            <template v-slot:item.nis="{ item }">
              <div>
                <span class="font-mono">{{ item.nis }}</span>
              </div>
            </template>

            <!-- Progress Chips for Week Data -->
            <template v-slot:item.z_total_pekan_lalu="{ item }">
              <b>{{ item.z_total_pekan_lalu || 0 }}</b>
            </template>

            <template v-slot:item.m_total_pekan_lalu="{ item }">
              <b>{{ item.m_total_pekan_lalu || 0 }}</b>
            </template>

            <template v-slot:item.z_total_pekan_ini="{ item }">
              <b>{{ item.z_total_pekan_ini || 0 }}</b>
            </template>

            <template v-slot:item.m_total_pekan_ini="{ item }">
              <b>{{ item.m_total_pekan_ini || 0 }}</b>
            </template>

            <!-- Total Hafalan with Progress -->
            <template v-slot:item.total="{ item }">
              <div>
                <!-- <v-progress-circular :model-value="getTotalProgress(item.total)" :size="30" :width="3" color="primary"
                  class="mr-2">
                  <span class="text-caption">{{ item.total }}</span>
                </v-progress-circular> -->
                <!-- <span class="font-weight-medium">{{ item.total }}</span> -->
                <v-chip color="black" variant="tonal" size="large" prepend-icon="mdi-book">
                  <b>{{ item.total }}</b>
                </v-chip>
              </div>
            </template>

            <!-- Grade with Icon -->
            <template v-slot:item.grade_name="{ item }">
              <div>
                <v-chip color="primary" variant="tonal" size="small">
                  <v-icon icon="mdi-school" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                  {{ item.grade_name }}
                </v-chip>
              </div>
            </template>

            <!-- Organization -->
            <template v-slot:item.organization_name="{ item }">
              <div>
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                {{ item.organization_name }}
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell justify-center">
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
                  {{ search ? 'No records match your search criteria.' : 'Keep up.' }}
                </p>
              </div>
            </template>
          </v-data-table>
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

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
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
</style>

<script>
import { useReportStorage } from '@/stores/reportStorage';
import { useSummaryStorage } from '@/stores/summaryStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import Chart from 'chart.js/auto';

export default {
  data: () => ({
    chartSecond: null,
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
    // Mock data for student memorization achievements (0-30 juz)
    mockMemorizationData: [
      { name: '0-2 Juz', count: 5 },
      { name: '3-5 Juz', count: 8 },
      { name: '6-10 Juz', count: 12 },
      { name: '11-15 Juz', count: 10 },
      { name: '16-20 Juz', count: 7 },
      { name: '21-25 Juz', count: 4 },
      { name: '26-30 Juz', count: 2 }
    ],
    // memorizationChart: null,
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
    setoranSummary: [],
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
    // Chart computed properties
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

    // createMemorizationChart() {
    //   // Destroy existing chart if it exists
    //   if (this.memorizationChart) {
    //     this.memorizationChart.destroy();
    //   }

    //   // Get chart context
    //   const ctx = this.$refs.memorizationChart.getContext('2d');

    //   // Extract labels and data from mock data
    //   const labels = this.mockMemorizationData.map(item => item.name);
    //   const data = this.mockMemorizationData.map(item => item.count);

    //   // Create the bar chart
    //   this.memorizationChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //       labels: labels,
    //       datasets: [{
    //         label: 'Jumlah Santri',
    //         data: data,
    //         backgroundColor: [
    //           'rgba(255, 99, 132, 0.7)',
    //           'rgba(54, 162, 235, 0.7)',
    //           'rgba(255, 205, 86, 0.7)',
    //           'rgba(75, 192, 192, 0.7)',
    //           'rgba(153, 102, 255, 0.7)',
    //           'rgba(255, 159, 64, 0.7)',
    //           'rgba(199, 199, 199, 0.7)'
    //         ],
    //         borderColor: [
    //           'rgba(255, 99, 132, 1)',
    //           'rgba(54, 162, 235, 1)',
    //           'rgba(255, 205, 86, 1)',
    //           'rgba(75, 192, 192, 1)',
    //           'rgba(153, 102, 255, 1)',
    //           'rgba(255, 159, 64, 1)',
    //           'rgba(199, 199, 199, 1)'
    //         ],
    //         borderWidth: 1
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       maintainAspectRatio: false,
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //           title: {
    //             display: true,
    //             text: 'Jumlah Santri'
    //           },
    //           ticks: {
    //             precision: 0
    //           }
    //         },
    //         x: {
    //           title: {
    //             display: true,
    //             text: 'Capaian Hafalan (Juz)'
    //           }
    //         }
    //       },
    //       plugins: {
    //         title: {
    //           display: true,
    //           text: 'Distribusi Capaian Hafalan Santri',
    //           font: {
    //             size: 16
    //           }
    //         },
    //         legend: {
    //           display: true,
    //           position: 'top'
    //         }
    //       }
    //     }
    //   });
    // },

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

      if (activeRole.value.constant_value === 4) {
        const query = {
          org_uuid: activeRole.value.org_uuid,
          student_uuid: activeRole.value.student_uuid,
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

      if (activeRole === 4) {
        const studentHeader = [
          {
            title: `${pekanLaluLabel}`,
            class: 'flex font-weight-bold align-center justify-center',
            children: [
              { title: 'Ziyadah', key: 'z_total_pekan_lalu', width: '100px' },
              { title: 'Murojaah', key: 'm_total_pekan_lalu', width: '100px' },
            ],
          },
          {
            title: `${pekanIniLabel}`,
            class: 'flex font-weight-bold align-center justify-center',
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
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
            align: 'center'
          },
        ]
        headers = headers.concat(studentHeader)
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

    async createSetoranChart() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const params = {
        sortOrder: '1',
        sortField: 'is_locked',
      };

      // summary start
      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid
        }
      }

      if (activeRole.value.constant_value === 3) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
          teacher_uuid: activeRole.value.teacher_uuid,
        }
      }

      if (activeRole.value.constant_value === 4) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
          student_uuid: activeRole.value.student_uuid,
        }
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
    this.createSetoranChart();
    // Initial data loading
    await this.fetchData()
    // Create the memorization chart
    // this.$nextTick(() => {
    //   this.createMemorizationChart();
    // });
  },

  beforeUnmount() {
    // Destroy the chart when component is unmounted
    // if (this.memorizationChart) {
    //   this.memorizationChart.destroy();
    // }

    if (this.chartSecond) {
      this.chartSecond.destroy();
    }
  }
}
</script>