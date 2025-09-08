<template>
    <div>
        <!-- Student Selection -->
        <v-card class="mb-4">
            <v-card-title>
                <v-icon left>mdi-account-school</v-icon>
                Pilih Siswa
            </v-card-title>
            <v-card-text>
                <v-select v-model="selectedStudent" :items="students" item-text="name" item-value="uuid"
                    label="Pilih Siswa" outlined dense @change="updateChart">
                    <template v-slot:prepend-item>
                        <v-list-item @click="selectAllStudents">
                            <v-list-item-action>
                                <v-icon>mdi-account-multiple</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>Tampilkan Semua Siswa</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </template>
                </v-select>
            </v-card-text>
        </v-card>

        <!-- Chart Card -->
        <v-card>
            <v-card-title>
                <v-icon left>mdi-chart-line</v-icon>
                Perkembangan Hafalan Al-Qur'an
                <v-spacer></v-spacer>
                <v-chip :color="totalPages > 0 ? 'success' : 'warning'" text-color="white" small>
                    Total: {{ totalPages }} Halaman
                </v-chip>
            </v-card-title>

            <v-card-text>
                <div ref="chartContainer" style="height: 400px;">
                    <canvas ref="chartCanvas"></canvas>
                </div>
            </v-card-text>

            <!-- Statistics -->
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="3">
                        <v-card color="primary" dark>
                            <v-card-text class="text-center">
                                <div class="text-h4">{{ totalPages }}</div>
                                <div>Total Halaman</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card color="success" dark>
                            <v-card-text class="text-center">
                                <div class="text-h4">{{ activeDays }}</div>
                                <div>Hari Setoran</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card color="warning" dark>
                            <v-card-text class="text-center">
                                <div class="text-h4">{{ averagePerDay.toFixed(1) }}</div>
                                <div>Rata-rata/Hari</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-card color="info" dark>
                            <v-card-text class="text-center">
                                <div class="text-h4">{{ lastSevenDays }}</div>
                                <div>7 Hari Terakhir</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Recent Activity -->
        <v-card class="mt-4">
            <v-card-title>
                <v-icon left>mdi-clock-outline</v-icon>
                Aktivitas Terbaru
            </v-card-title>
            <v-card-text>
                <v-list dense>
                    <v-list-item v-for="(activity, index) in recentActivities" :key="index"
                        :class="index % 2 === 0 ? 'grey lighten-5' : ''">
                        <v-list-item-avatar>
                            <v-icon :color="activity.type === 'ziyadah' ? 'success' : 'primary'">
                                mdi-book-open-page-variant
                            </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ activity.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                {{ formatDate(activity.date_input) }} - {{ activity.student_name }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-chip :color="activity.type === 'ziyadah' ? 'success' : 'primary'" text-color="white"
                                x-small>
                                {{ activity.type }}
                            </v-chip>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
    name: 'QuranMemorizationChart',

    data() {
        return {
            selectedStudent: null,
            chart: null,

            // Mock data untuk siswa
            students: [
                { uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d', name: 'Ahmad Zaki' },
                { uuid: '9ec6c90c-1234-4259-9ff7-3bc753b8493d', name: 'Fatimah Sari' },
                { uuid: '9ec6c90c-5678-4259-9ff7-3bc753b8493d', name: 'Muhammad Ridwan' },
                { uuid: '9ec6c90c-9012-4259-9ff7-3bc753b8493d', name: 'Aisyah Putri' },
            ],

            // Mock data untuk laporan hafalan
            memorizations: [
                {
                    uuid: '9ec6d7c7-01c2-45fc-98fc-6004d47f036f',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-20 13:50:00',
                    name: 'Juz 30 Halaman 1A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-0fa8-4e01-b35f-1c4a816b5fd5',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-20 14:00:00',
                    name: 'Juz 30 Halaman 1B',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-1930-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-22 13:50:00',
                    name: 'Juz 30 Halaman 2A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-266b-4ad1-b4a7-af7f54a252ec',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-22 14:00:00',
                    name: 'Juz 30 Halaman 2B',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-3333-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-25 10:30:00',
                    name: 'Juz 30 Halaman 3A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-4444-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-9959-4259-9ff7-3bc753b8493d',
                    student_name: 'Ahmad Zaki',
                    date_input: '2024-07-28 09:15:00',
                    name: 'Juz 30 Halaman 3B',
                    type_report: 'ziyadah'
                },
                // Data untuk siswa lain
                {
                    uuid: '9ec6d7c7-5555-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-1234-4259-9ff7-3bc753b8493d',
                    student_name: 'Fatimah Sari',
                    date_input: '2024-07-21 08:00:00',
                    name: 'Juz 29 Halaman 1A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-6666-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-1234-4259-9ff7-3bc753b8493d',
                    student_name: 'Fatimah Sari',
                    date_input: '2024-07-23 08:30:00',
                    name: 'Juz 29 Halaman 1B',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-7777-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-1234-4259-9ff7-3bc753b8493d',
                    student_name: 'Fatimah Sari',
                    date_input: '2024-07-26 07:45:00',
                    name: 'Juz 29 Halaman 2A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-8888-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-5678-4259-9ff7-3bc753b8493d',
                    student_name: 'Muhammad Ridwan',
                    date_input: '2024-07-24 16:00:00',
                    name: 'Juz 28 Halaman 1A',
                    type_report: 'ziyadah'
                },
                {
                    uuid: '9ec6d7c7-9999-4525-b030-61821107ea80',
                    student_uuid: '9ec6c90c-5678-4259-9ff7-3bc753b8493d',
                    student_name: 'Muhammad Ridwan',
                    date_input: '2024-07-29 15:30:00',
                    name: 'Juz 28 Halaman 1B',
                    type_report: 'ziyadah'
                }
            ]
        }
    },

    computed: {
        filteredMemorizations() {
            if (!this.selectedStudent) return []
            return this.memorizations.filter(m => m.student_uuid === this.selectedStudent)
        },

        totalPages() {
            return this.filteredMemorizations.length
        },

        activeDays() {
            const uniqueDates = [...new Set(this.filteredMemorizations.map(m =>
                new Date(m.date_input).toDateString()
            ))]
            return uniqueDates.length
        },

        averagePerDay() {
            return this.activeDays > 0 ? this.totalPages / this.activeDays : 0
        },

        lastSevenDays() {
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

            return this.filteredMemorizations.filter(m =>
                new Date(m.date_input) >= sevenDaysAgo
            ).length
        },

        recentActivities() {
            return [...this.memorizations]
                .sort((a, b) => new Date(b.date_input) - new Date(a.date_input))
                .slice(0, 10)
        }
    },

    mounted() {
        // Set default student
        if (this.students.length > 0) {
            this.selectedStudent = this.students[0].uuid
            this.updateChart()
        }
    },

    beforeUnmount() {
        if (this.chart) {
            this.chart.destroy()
        }
    },

    methods: {
        selectAllStudents() {
            // Implementasi untuk menampilkan semua siswa (untuk pengembangan selanjutnya)
            this.selectedStudent = null
        },

        updateChart() {
            if (!this.selectedStudent) return

            const chartData = this.prepareChartData()
            this.createChart(chartData)
        },

        prepareChartData() {
            // Group data by date and count cumulative pages
            const dataByDate = {}
            let cumulativeCount = 0

            const sortedData = [...this.filteredMemorizations].sort((a, b) =>
                new Date(a.date_input) - new Date(b.date_input)
            )

            sortedData.forEach(item => {
                const date = new Date(item.date_input).toISOString().split('T')[0]

                if (!dataByDate[date]) {
                    dataByDate[date] = 0
                }
                dataByDate[date]++
            })

            // Convert to chart format
            const labels = []
            const data = []

            Object.keys(dataByDate).sort().forEach(date => {
                cumulativeCount += dataByDate[date]
                labels.push(this.formatDateLabel(date))
                data.push(cumulativeCount)
            })

            return { labels, data }
        },

        createChart(chartData) {
            if (this.chart) {
                this.chart.destroy()
            }

            const ctx = this.$refs.chartCanvas.getContext('2d')

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Jumlah Halaman Terhafal',
                        data: chartData.data,
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
                            text: `Perkembangan Hafalan - ${this.getStudentName()}`,
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
                                text: 'Tanggal'
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
            })
        },

        getStudentName() {
            const student = this.students.find(s => s.uuid === this.selectedStudent)
            return student ? student.name : 'Unknown'
        },

        formatDate(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },

        formatDateLabel(dateString) {
            const date = new Date(dateString)
            return date.toLocaleDateString('id-ID', {
                month: 'short',
                day: 'numeric'
            })
        }
    }
}
</script>

<style scoped>
.v-card {
    margin-bottom: 16px;
}

.text-h4 {
    font-weight: bold;
}

canvas {
    max-height: 400px !important;
}
</style>
