<template>
    <v-container fluid class="pa-0">
        <!-- Hero Section with Student Profile -->
        <v-row class="ma-0">
            <v-col cols="12" class="pa-0">
                <div class="hero-section">
                    <div class="hero-overlay">
                        <v-container class="hero-content">
                            <v-row class="align-center justify-center text-center">
                                <v-col cols="12" md="10">
                                    <!-- Student Avatar -->
                                    <div class="student-avatar-container mb-6">
                                        <v-avatar size="140" class="student-hero-avatar elevation-8">
                                            <v-img v-if="student?.profile_image_url" :src="student.profile_image_url"
                                                :alt="studentFullName" cover></v-img>
                                            <v-icon v-else icon="mdi-account-school" size="90" color="white"></v-icon>
                                        </v-avatar>
                                    </div>

                                    <!-- Student Name and Info -->
                                    <h1 class="hero-title text-h2 font-weight-bold mb-4 text-white">
                                        {{ studentFullName }}
                                    </h1>

                                    <div class="hero-badges mb-4">
                                        <v-chip color="success" variant="elevated" size="large"
                                            prepend-icon="mdi-school" class="mr-2 mb-2">
                                            {{ student?.grade_name || 'Student' }}
                                        </v-chip>
                                        <v-chip color="info" variant="elevated" size="large" prepend-icon="mdi-domain"
                                            class="mb-2">
                                            {{ student?.organization_name || 'Institution' }}
                                        </v-chip>
                                    </div>

                                    <p class="hero-description text-h6 text-white mb-6" v-if="student?.bio">
                                        {{ student.bio }}
                                    </p>

                                    <!-- Achievement Summary -->
                                    <div class="achievement-summary">
                                        <v-row class="justify-center">
                                            <v-col cols="12" sm="12">
                                                <div class="achievement-item">
                                                    <div class="achievement-number text-h3 font-weight-bold">
                                                        {{ student?.total || '0' }}
                                                    </div>
                                                    <div class="achievement-label">Total Hafalan</div>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </div>
            </v-col>
        </v-row>

        <v-container class="py-8" v-if="student && Object.keys(student).length > 0">
            <!-- Student Information Section -->
            <v-row class="mb-8">
                <v-col cols="12">
                    <div class="section-header mb-6 text-center">
                        <h2 class="text-h3 font-weight-bold mb-2">Student Profile</h2>
                        <p class="text-h6 text-medium-emphasis">Personal information and academic details</p>
                    </div>

                    <v-row>
                        <!-- Personal Information -->
                        <v-col cols="12" md="6">
                            <v-card class="modern-card info-card" elevation="6">
                                <v-card-title class="card-header pa-6">
                                    <div class="d-flex align-center">
                                        <v-icon icon="mdi-account-details" size="24" class="mr-3"
                                            color="primary"></v-icon>
                                        <span class="text-h6 font-weight-bold">Personal Information</span>
                                    </div>
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-card-text class="pa-6">
                                    <div class="info-items">
                                        <div class="info-item" v-if="student.nik">
                                            <v-icon icon="mdi-card-account-details" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">NIK</div>
                                                <div class="info-value">{{ student.nik }}</div>
                                            </div>
                                        </div>

                                        <div class="info-item" v-if="student.nis">
                                            <v-icon icon="mdi-school" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">NIS</div>
                                                <div class="info-value">{{ student.nis }}</div>
                                            </div>
                                        </div>

                                        <div class="info-item" v-if="student.birthdate">
                                            <v-icon icon="mdi-calendar" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Birthdate</div>
                                                <div class="info-value">{{ formatDate(student.birthdate) }}</div>
                                            </div>
                                        </div>

                                        <div class="info-item" v-if="student.phone">
                                            <v-icon icon="mdi-phone" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Contact</div>
                                                <div class="info-value">{{ student.phone }}</div>
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>

                        <!-- Academic Information -->
                        <v-col cols="12" md="6">
                            <v-card class="modern-card academic-card" elevation="6">
                                <v-card-title class="card-header pa-6">
                                    <div class="d-flex align-center">
                                        <v-icon icon="mdi-school" size="24" class="mr-3" color="primary"></v-icon>
                                        <span class="text-h6 font-weight-bold">Academic Information</span>
                                    </div>
                                </v-card-title>

                                <v-divider></v-divider>

                                <v-card-text class="pa-6">
                                    <div class="info-items">
                                        <div class="info-item" v-if="student.organization_name">
                                            <v-icon icon="mdi-domain" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Institution</div>
                                                <div class="info-value">{{ student.organization_name }}</div>
                                            </div>
                                        </div>

                                        <div class="info-item" v-if="student.grade_name">
                                            <v-icon icon="mdi-school-outline" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Grade/Class</div>
                                                <div class="info-value">{{ student.grade_name }}</div>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <v-icon icon="mdi-book-open-page-variant" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Total Hafalan</div>
                                                <div class="info-value-highlight">{{ student.total || '0' }} Pages</div>
                                            </div>
                                        </div>

                                        <div class="info-item">
                                            <v-icon icon="mdi-trending-up" size="small"
                                                class="mr-3 text-medium-emphasis"></v-icon>
                                            <div>
                                                <div class="info-label">Status</div>
                                                <v-chip color="success" variant="tonal" size="small">Active
                                                    Learning</v-chip>
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <!-- Charts Section -->
            <v-row class="mb-8">
                <v-col cols="12" md="6">
                    <v-card class="modern-card chart-card" elevation="6">
                        <v-card-title class="card-header pa-6">
                            <div class="d-flex align-center">
                                <v-icon icon="mdi-chart-line" size="24" class="mr-3" color="primary"></v-icon>
                                <span class="text-h6 font-weight-bold">Weekly Reports</span>
                            </div>
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-text class="pa-6">
                            <div class="chart-container">
                                <canvas ref="reportChart"></canvas>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="6">
                    <v-card class="modern-card chart-card" elevation="6">
                        <v-card-title class="card-header pa-6">
                            <div class="d-flex align-center">
                                <v-icon icon="mdi-chart-bar" size="24" class="mr-3" color="secondary"></v-icon>
                                <span class="text-h6 font-weight-bold">Daily Progress</span>
                            </div>
                        </v-card-title>

                        <v-divider></v-divider>

                        <v-card-text class="pa-6">
                            <div class="chart-container">
                                <canvas ref="progressChart"></canvas>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Recent Reports Section -->
            <v-row class="mb-8" v-if="recentReports.length > 0">
                <v-col cols="12">
                    <div class="section-header mb-6 text-center">
                        <h2 class="text-h3 font-weight-bold mb-2">Recent Learning Reports</h2>
                        <p class="text-h6 text-medium-emphasis">Latest submissions and achievements</p>
                    </div>

                    <v-card class="modern-card reports-card" elevation="6">
                        <v-card-text class="pa-0">
                            <div class="reports-list">
                                <div v-for="(report, index) in recentReports" :key="index" class="report-item">
                                    <div class="report-date">
                                        <v-icon icon="mdi-calendar" size="small" class="mr-2"></v-icon>
                                        {{ formatDate(report.date_input) }}
                                    </div>

                                    <div class="report-content">
                                        <div class="report-type">
                                            <v-chip :color="getTypeColor(report.type_report)" variant="tonal"
                                                size="small" :prepend-icon="getTypeIcon(report.type_report)">
                                                {{ formatType(report.type_report) }}
                                            </v-chip>
                                        </div>

                                        <div class="report-details">
                                            <span class="report-range">
                                                {{ report.start_juz_page_name }} - {{ report.end_juz_page_name }}
                                            </span>
                                        </div>

                                        <div class="report-total">
                                            <v-chip color="primary" variant="tonal" size="large">
                                                <strong>{{ report.total || '0' }}</strong>
                                            </v-chip>
                                        </div>
                                    </div>

                                    <v-divider v-if="index < recentReports.length - 1"></v-divider>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Student Not Found State -->
        <v-container v-else-if="!loading" class="py-12">
            <v-row>
                <v-col cols="12">
                    <v-card class="modern-card" elevation="6">
                        <v-card-text class="pa-12 text-center">
                            <v-icon icon="mdi-account-off" size="96" color="grey-lighten-1" class="mb-6"></v-icon>
                            <h1 class="text-h3 font-weight-bold mb-4">Student Not Found</h1>
                            <p class="text-h6 text-medium-emphasis mb-6">
                                The student profile you're looking for doesn't exist or may not be publicly visible.
                            </p>
                            <v-btn color="primary" variant="elevated" size="large" href="/" prepend-icon="mdi-home">
                                Go Home
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Loading State -->
        <v-container v-if="loading" class="py-12">
            <v-row>
                <v-col cols="12" class="text-center">
                    <v-progress-circular indeterminate color="primary" size="64" class="mb-4"></v-progress-circular>
                    <h2 class="text-h5">Loading student profile...</h2>
                </v-col>
            </v-row>
        </v-container>

        <!-- Footer -->
        <v-footer class="bg-grey-lighten-5 text-center pa-8" v-if="student && Object.keys(student).length > 0">
            <div>
                <p class="text-body-2 text-medium-emphasis mb-2">
                    Student Progress Report • {{ student.organization_name }}
                </p>
                <p class="text-caption text-medium-emphasis">
                    Last updated: {{ formatDate(new Date()) }}
                </p>
            </div>
        </v-footer>
    </v-container>
</template>

<style scoped>
/* Hero Section */
.hero-section {
    min-height: 70vh;
    background: linear-gradient(135deg,
            #667eea 0%,
            #764ba2 25%,
            #f093fb 50%,
            #f5576c 75%,
            #4facfe 100%);
    background-size: 300% 300%;
    animation: gradientShift 15s ease infinite;
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 25%),
        radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 25%),
        linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.03) 50%, transparent 60%);
    opacity: 1;
}

.hero-overlay {
    position: relative;
    z-index: 1;
    width: 100%;
    padding: 60px 0;
}

.hero-content {
    max-width: 1200px;
}

.student-avatar-container {
    position: relative;
    display: inline-block;
}

.student-hero-avatar {
    border: 5px solid rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.hero-title {
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    background: linear-gradient(45deg, #ffffff, #f8f9ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    max-width: 600px;
    margin: 0 auto;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.95);
}

.hero-badges .v-chip {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
}

.achievement-summary {
    margin-top: 2rem;
}

.achievement-item {
    text-align: center;
    padding: 1rem;
}

.achievement-number {
    background: linear-gradient(45deg, #ffffff, #f8f9ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.achievement-label {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.875rem;
}

/* Modern Cards */
.modern-card {
    border-radius: 24px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    background: linear-gradient(145deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.8) 100%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.2);
}

/* Section Headers */
.section-header {
    margin-bottom: 3rem;
}

.section-header h2 {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Card Headers */
.card-header {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.02) 100%);
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

/* Info Items */
.info-items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.info-item {
    display: flex;
    align-items: flex-start;
    padding: 1.5rem;
    border-radius: 16px;
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.03) 100%);
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;
}

.info-item:hover {
    background: linear-gradient(135deg,
            rgba(102, 126, 234, 0.1) 0%,
            rgba(118, 75, 162, 0.05) 100%);
    transform: translateX(8px);
}

.info-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.25rem;
}

.info-value {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
}

.info-value-highlight {
    font-size: 1.1rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Progress Stats */
.progress-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stat-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 12px;
    background: rgba(var(--v-theme-surface-variant), 0.05);
    transition: all 0.3s ease;
}

.stat-item:hover {
    background: rgba(var(--v-theme-surface-variant), 0.1);
    transform: scale(1.02);
}

.stat-icon {
    margin-right: 1rem;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
}

/* Chart Container */
.chart-container {
    position: relative;
    height: 300px;
    width: 100%;
}

/* Reports List */
.reports-list {
    max-height: 400px;
    overflow-y: auto;
}

.report-item {
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.report-item:hover {
    background: rgba(102, 126, 234, 0.05);
}

.report-date {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
}

.report-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.report-type {
    min-width: 120px;
}

.report-details {
    flex: 1;
    min-width: 200px;
}

.report-range {
    font-weight: 500;
    color: #374151;
}

.report-total {
    min-width: 80px;
}

/* Responsive Design */
@media (max-width: 960px) {
    .hero-section {
        min-height: 50vh;
    }

    .hero-title {
        font-size: 2.5rem !important;
    }

    .student-hero-avatar {
        width: 120px !important;
        height: 120px !important;
    }

    .achievement-number {
        font-size: 2rem !important;
    }
}

@media (max-width: 600px) {
    .hero-section {
        min-height: 40vh;
    }

    .hero-title {
        font-size: 2rem !important;
    }

    .student-hero-avatar {
        width: 100px !important;
        height: 100px !important;
    }

    .achievement-number {
        font-size: 1.5rem !important;
    }

    .report-content {
        flex-direction: column;
        align-items: flex-start;
    }
}

/* Animation for page load */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modern-card {
    animation: fadeInUp 0.8s ease-out;
}

.modern-card:nth-child(2) {
    animation-delay: 0.2s;
}

.modern-card:nth-child(3) {
    animation-delay: 0.4s;
}
</style>

<script>
import Chart from 'chart.js/auto';
import { useStudentStorage } from '@/stores/studentStorage';
import { useReportStorage } from '@/stores/reportStorage';
import moment from 'moment';

export default {
    name: 'PublicStudentSummaryView',
    data: () => ({
        slug: null,
        loading: false,
        student: {},
        reports: [],
        recentReports: [],
        reportSummary: [],
        progressData: [],
        reportChart: null,
        progressChart: null,
    }),

    computed: {
        studentFullName() {
            if (!this.student) return 'Student';
            return `${this.student.firstname || ''} ${this.student.lastname || ''}`.trim() || 'Student';
        },

        totalReports() {
            return this.reports.length || 0;
        },
    },

    methods: {
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

        async loadStudentData() {
            this.loading = true;
            try {
                const studentStorage = useStudentStorage();
                const data = await studentStorage.showStudentByUUID(this.slug);

                // Only show if student data exists and is accessible
                if (data && data.data && data.data.student) {
                    this.student = data.data.student;
                    await this.loadReports();
                    await this.createCharts();
                } else {
                    this.student = {};
                }
            } catch (error) {
                console.error('Error loading student data:', error);
                this.student = {};
            } finally {
                this.loading = false;
            }
        },

        async loadReports() {
            try {
                const reportStorage = useReportStorage();

                // Load recent reports (last 10)
                const reportsParams = {
                    page: 1,
                    limit: 10,
                    sortOrder: '-1',
                    sortField: 'date_input',
                    filter: {
                        student_uuid: this.slug,
                    }
                };

                const reportsData = await reportStorage.getReports(reportsParams);
                this.reports = reportsData.data || [];
                this.recentReports = this.reports.slice(0, 5); // Show only 5 recent reports

                // Load report summary for charts
                const summaryParams = {
                    sortOrder: '1',
                    sortField: 'week_start',
                    filter: {
                        student_uuid: this.slug,
                    }
                };

                const summaryData = await reportStorage.getReportSummary(summaryParams);
                this.reportSummary = summaryData.data || [];

                // Load progress data for second chart
                const progressParams = {
                    sortOrder: '1',
                    sortField: 'date',
                    filter: {
                        student_uuid: this.slug,
                    }
                };

                const progressData = await reportStorage.getSetoranSummary(progressParams);
                this.progressData = progressData.data || [];

            } catch (error) {
                console.error('Error loading reports:', error);
                this.reports = [];
                this.recentReports = [];
                this.reportSummary = [];
                this.progressData = [];
            }
        },

        async createCharts() {
            await this.$nextTick();
            this.createReportChart();
            this.createProgressChart();
        },

        createReportChart() {
            if (this.reportChart) {
                this.reportChart.destroy();
            }

            if (!this.$refs.reportChart) return;

            const ctx = this.$refs.reportChart.getContext('2d');

            // Prepare chart data from report summary
            const labels = this.reportSummary.map(item => {
                const startDate = new Date(item.week_start);
                const endDate = new Date(item.week_end);
                return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
            });

            const data = this.reportSummary.map(item => item.reports || 0);

            this.reportChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Weekly Reports',
                        data: data,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#667eea',
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
                            display: false
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(102, 126, 234, 0.1)'
                            },
                            ticks: {
                                color: '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(102, 126, 234, 0.1)'
                            },
                            ticks: {
                                color: '#6b7280',
                                maxRotation: 45
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

        createProgressChart() {
            if (this.progressChart) {
                this.progressChart.destroy();
            }

            if (!this.$refs.progressChart) return;

            const ctx = this.$refs.progressChart.getContext('2d');

            // Prepare chart data from progress data
            const labels = this.progressData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });

            const data = this.progressData.map(item => item.jumlah_halaman || 0);

            this.progressChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Pages',
                        data: data,
                        backgroundColor: 'rgba(118, 75, 162, 0.6)',
                        borderColor: '#764ba2',
                        borderWidth: 1,
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: false
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(118, 75, 162, 0.1)'
                            },
                            ticks: {
                                color: '#6b7280'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#6b7280',
                                maxRotation: 45
                            }
                        }
                    }
                }
            });
        }
    },

    async mounted() {
        this.slug = this.$route.params.slug;
        await this.loadStudentData();
    },

    beforeUnmount() {
        if (this.reportChart) {
            this.reportChart.destroy();
        }
        if (this.progressChart) {
            this.progressChart.destroy();
        }
    },

    head() {
        if (this.student && Object.keys(this.student).length > 0) {
            const studentName = this.studentFullName;
            return {
                title: `${studentName} - Student Progress Report`,
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: `View ${studentName}'s learning progress and achievements at ${this.student.organization_name || 'their institution'}`
                    },
                    {
                        hid: 'og:title',
                        property: 'og:title',
                        content: `${studentName} - Student Progress Report`
                    },
                    {
                        hid: 'og:description',
                        property: 'og:description',
                        content: `Track ${studentName}'s Quran memorization progress and learning reports`
                    },
                    {
                        hid: 'og:image',
                        property: 'og:image',
                        content: this.student.profile_image_url || ''
                    }
                ]
            }
        }
        return {
            title: 'Student Progress Report',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: 'View student learning progress and achievements'
                }
            ]
        }
    }
};
</script>
