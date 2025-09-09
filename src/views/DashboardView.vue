<template>
  <v-container fluid class="pa-4">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-section">
          <div class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div class="page-title-section mb-4 mb-md-0">
              <h1 class="page-title text-h4 font-weight-bold mb-2">
                <v-icon icon="mdi-view-dashboard" class="mr-3" color="primary"></v-icon>
                Dashboard
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Overview of Tahfeed learning progress and statistics
              </p>
            </div>

            <!-- Date Filter -->
            <!-- <div class="date-filter-section">
              <v-select v-model="selectedPeriod" :items="periodOptions" item-title="label" item-value="value"
                variant="outlined" prepend-inner-icon="mdi-calendar-range" label="Period"
                @update:modelValue="fetchDashboardData" class="period-selector" density="comfortable"
                style="min-width: 200px;"></v-select>
            </div> -->
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row class="mb-6">

      <v-col cols="12" sm="6" lg="4" v-if="isSuperAdmin">
        <v-card class="stats-card stats-card-success" elevation="4">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold text-success mb-1">
                  {{ dashboardData.totalOrgs || 0 }}
                </div>
                <div class="text-body-2 text-medium-emphasis">Total Organizations</div>
              </div>
              <v-avatar size="64" color="success" variant="tonal">
                <v-icon icon="mdi-home-group" size="32"></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4" v-if="isSuperAdmin">
        <v-card class="stats-card stats-card-primary" elevation="4">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold text-primary mb-1">
                  {{ dashboardData.totalUsers || 0 }}
                </div>
                <div class="text-body-2 text-medium-emphasis">Total Users</div>
              </div>
              <v-avatar size="64" color="primary" variant="tonal">
                <v-icon icon="mdi-account-group-outline" size="32"></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <v-card class="stats-card stats-card-secondary" elevation="4">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold text-secondary mb-1">
                  {{ dashboardData.totalTeachers || 0 }}
                </div>
                <div class="text-body-2 text-medium-emphasis">Total Teachers</div>
              </div>
              <v-avatar size="64" color="secondary" variant="tonal">
                <v-icon icon="mdi-human-male-board" size="32"></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <v-card class="stats-card stats-card-warning" elevation="4">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold text-warning mb-1">
                  {{ dashboardData.totalKelases || 0 }}
                </div>
                <div class="text-body-2 text-medium-emphasis">Class</div>
              </div>
              <v-avatar size="64" color="warning" variant="tonal">
                <v-icon icon="mdi-google-classroom" size="32"></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="4">
        <v-card class="stats-card stats-card-primary" elevation="4">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center">
              <div>
                <div class="text-h4 font-weight-bold text-primary mb-1">
                  {{ dashboardData.totalStudents || 0 }}
                </div>
                <div class="text-body-2 text-medium-emphasis">Total Students</div>
              </div>
              <v-avatar size="64" color="primary" variant="tonal">
                <v-icon icon="mdi-account-school-outline" size="32"></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>

    <!-- setoran trends start -->
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
    <!-- setoran end -->

    <!-- REPORT START -->
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
    <!-- REPORT END -->

    <!-- Loading Overlay -->
    <v-overlay v-model="loading" contained class="align-center justify-center">
      <div class="text-center">
        <v-progress-circular size="64" indeterminate color="primary" class="mb-4"></v-progress-circular>
        <div class="text-h6">Loading Dashboard...</div>
      </div>
    </v-overlay>
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

.period-selector :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stats-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stats-card-primary {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.stats-card-secondary {
  border-left: 4px solid rgb(var(--v-theme-secondary));
}

.stats-card-success {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.stats-card-warning {
  border-left: 4px solid rgb(var(--v-theme-warning));
}

.chart-card,
.activities-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.chart-container {
  position: relative;
  width: 100%;
}

.activity-item {
  transition: background-color 0.2s ease;
}

.activity-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.02);
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .stats-card .pa-6 {
    padding: 16px !important;
  }

  .chart-card .pa-6 {
    padding: 16px !important;
  }

  .chart-container {
    height: 300px !important;
  }
}

/* Dark mode adjustments */
.v-theme--dark .stats-card,
.v-theme--dark .chart-card,
.v-theme--dark .activities-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
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

import { useDashboardStorage } from '@/stores/dashboardStorage';
import { useReportStorage } from '@/stores/reportStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  DoughnutController,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default {
  data: () => ({
    chart: null,
    chartSecond: null,
    isSuperAdmin: false,
    loading: false,
    selectedPeriod: 'month',
    periodOptions: [
      { label: 'This Month', value: 'month' },
      { label: 'Last 3 Months', value: '3months' },
      { label: 'Last 6 Months', value: '6months' },
      { label: 'This Year', value: 'year' }
    ],
    dashboardData: {
      totalStudents: 0,
      totalTeachers: 0,
      totalReports: 0,
      totalKelases: 0,
      totalUsers: 0,
      totalOrgs: 0,
    },
    recentActivities: [],
    charts: {
      classStats: null,
      reportTypes: null,
      progressTrends: null,
      gradeDistribution: null
    },
    reportSummary: [],
    setoranSummary: [],
  }),

  async mounted() {
    await this.fetchDashboardData();
    this.initializeCharts();
    this.createChart();

    this.createSetoranChart();
  },

  beforeUnmount() {
    // Destroy charts to prevent memory leaks
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
    if (this.chart) {
      this.chart.destroy();
    }
    if (this.chartSecond) {
      this.chartSecond.destroy();
    }
  },

  computed: {
    totalReports() {
      return this.reportSummary.reduce((sum, item) => sum + item.reports, 0);
    },
    weeklyGrowth() {
      if (this.reportSummary.length < 2) return 0;
      const latestWeek = this.reportSummary[this.reportSummary.length - 1].reports;
      const previousWeek = this.reportSummary[this.reportSummary.length - 2].reports;
      if (previousWeek === 0) return 0;
      return (((latestWeek - previousWeek) / previousWeek) * 100).toFixed(2);
    },
    avgReportsPerWeek() {
      if (this.reportSummary.length === 0) return 0;
      return Math.round(this.totalReports / this.reportSummary.length);
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

  methods: {
    async fetchDashboardData() {
      this.loading = true;
      try {
        const userStorage = useUserStorage();
        const { activeRole } = storeToRefs(userStorage);

        const params = {
          period: this.selectedPeriod,
        };

        if (Number(activeRole.value.constant_value) === Number(1)) {
          this.isSuperAdmin = true;
          params.filter = {
            ...params.filter,
            is_superadmin: 1,
          };
        }

        // Add organization filter for non-super super admin roles
        if (activeRole.value.constant_value !== 1) {
          // let is_admin = 0;
          // if (activeRole.value.constant_value === 1) { // ADMIN Role
          //   is_admin = 1;
          // }

          params.filter = {
            ...params.filter,
            org_uuid: activeRole.value.org_uuid,
            // is_admin: is_admin,
          };
        }

        // Fetch dashboard statistics (you'll need to create these API endpoints)
        // For now, using mock data based on your database structure
        await this.fetchStatistics(params);
        await this.fetchRecentActivities(params);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics(params) {
      const dashboardStorage = useDashboardStorage()
      const data = await dashboardStorage.getDashboard(params)
      const dashboardData = data.data

      // Mock data - replace with actual API calls
      this.dashboardData = {
        totalStudents: dashboardData.totalStudents,
        totalTeachers: dashboardData.totalTeachers,
        totalReports: dashboardData.totalReports,
        totalKelases: dashboardData.totalKelases,
        totalUsers: dashboardData.totalUsers,
        totalOrgs: dashboardData.totalOrgs,
      };
    },

    async fetchRecentActivities(params) {
      // Mock data - replace with actual API calls
      this.recentActivities = [
        {
          type: 'ziyadah',
          title: 'New Ziyadah Report',
          description: 'Ahmad completed Juz 1 Page 15-20',
          created_at: new Date().toISOString()
        },
        {
          type: 'murojaah',
          title: 'Murojaah Session',
          description: 'Fatimah reviewed Juz 2 Page 1-10',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'student',
          title: 'New Student Registered',
          description: 'Ali joined Grade 5A',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'achievement',
          title: 'Milestone Achieved',
          description: 'Sarah completed her 5th Juz',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ];
    },

    initializeCharts() {
      this.$nextTick(() => {
        this.createClassStatsChart();
        this.createReportTypesChart();
        this.createProgressTrendsChart();
        this.createGradeDistributionChart();
      });
    },

    createClassStatsChart() {
      const ctx = this.$refs.classStatsChart?.getContext('2d');
      if (!ctx) return;

      if (this.charts.classStats) {
        this.charts.classStats.destroy();
      }

      this.charts.classStats = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: ['Grade 1A', 'Grade 1B', 'Grade 2A', 'Grade 2B', 'Grade 3A', 'Grade 3B'],
          datasets: [
            {
              label: 'Ziyadah',
              data: [45, 38, 52, 41, 33, 47],
              backgroundColor: 'rgba(76, 175, 80, 0.8)',
              borderColor: 'rgba(76, 175, 80, 1)',
              borderWidth: 1
            },
            {
              label: 'Murojaah',
              data: [32, 28, 35, 30, 25, 33],
              backgroundColor: 'rgba(255, 193, 7, 0.8)',
              borderColor: 'rgba(255, 193, 7, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: false
            }
          }
        }
      });
    },

    createReportTypesChart() {
      const ctx = this.$refs.reportTypesChart?.getContext('2d');
      if (!ctx) return;

      if (this.charts.reportTypes) {
        this.charts.reportTypes.destroy();
      }

      this.charts.reportTypes = new ChartJS(ctx, {
        type: 'pie',
        data: {
          labels: ['Ziyadah', 'Murojaah', 'Review'],
          datasets: [{
            data: [62, 28, 10],
            backgroundColor: [
              'rgba(76, 175, 80, 0.8)',
              'rgba(255, 193, 7, 0.8)',
              'rgba(33, 150, 243, 0.8)'
            ],
            borderColor: [
              'rgba(76, 175, 80, 1)',
              'rgba(255, 193, 7, 1)',
              'rgba(33, 150, 243, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    },

    createProgressTrendsChart() {
      const ctx = this.$refs.progressTrendsChart?.getContext('2d');
      if (!ctx) return;

      if (this.charts.progressTrends) {
        this.charts.progressTrends.destroy();
      }

      this.charts.progressTrends = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'New Students',
              data: [12, 18, 15, 22, 16, 25],
              borderColor: 'rgba(63, 81, 181, 1)',
              backgroundColor: 'rgba(63, 81, 181, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Completed Juz',
              data: [85, 92, 78, 105, 88, 112],
              borderColor: 'rgba(76, 175, 80, 1)',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            }
          }
        }
      });
    },

    createGradeDistributionChart() {
      const ctx = this.$refs.gradeDistributionChart?.getContext('2d');
      if (!ctx) return;

      if (this.charts.gradeDistribution) {
        this.charts.gradeDistribution.destroy();
      }

      this.charts.gradeDistribution = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
          datasets: [{
            data: [25, 30, 20, 15, 10],
            backgroundColor: [
              'rgba(255, 87, 34, 0.8)',
              'rgba(156, 39, 176, 0.8)',
              'rgba(63, 81, 181, 0.8)',
              'rgba(76, 175, 80, 0.8)',
              'rgba(255, 193, 7, 0.8)'
            ],
            borderColor: [
              'rgba(255, 87, 34, 1)',
              'rgba(156, 39, 176, 1)',
              'rgba(63, 81, 181, 1)',
              'rgba(76, 175, 80, 1)',
              'rgba(255, 193, 7, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.label + ': ' + context.parsed + ' students';
                }
              }
            }
          }
        }
      });
    },

    formatDate(date) {
      return moment(date).fromNow();
    },

    getActivityIcon(type) {
      const icons = {
        ziyadah: 'mdi-plus-circle',
        murojaah: 'mdi-refresh',
        student: 'mdi-account-plus',
        achievement: 'mdi-trophy',
        review: 'mdi-eye'
      };
      return icons[type] || 'mdi-information';
    },

    getActivityColor(type) {
      const colors = {
        ziyadah: 'success',
        murojaah: 'warning',
        student: 'primary',
        achievement: 'secondary',
        review: 'info'
      };
      return colors[type] || 'grey';
    },
    async createChart() {
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
    async refreshData() {
      await this.fetchDashboardData();
      await this.createChart();
      await this.createSetoranChart();
    }
  },
};
</script>