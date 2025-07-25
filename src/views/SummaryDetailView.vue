<template>
  <v-container>
    <v-row>
      <div>
        <v-breadcrumbs :items="breadcrumbsItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </v-row>

    <v-row v-if="(student !== undefined)">
      <v-col cols="12">
        <v-card-item>
          <v-card-title>
            <div>
              <v-icon icon="mdi-home-account" end></v-icon>
              {{ student.firstname }} {{ student.lastname }}
            </div>

          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>NIK</b>
                  </th>
                  <th class="text-left">
                    {{ student.nik }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>NIS</b>
                  </th>
                  <th class="text-left">
                    {{ student.nis }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Full Name</b>
                  </th>
                  <th class="text-left">
                    {{ student.firstname }} {{ student.lastname }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Birthdate</b>
                  </th>
                  <th class="text-left">
                    {{ student.birthdate }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Bio</b>
                  </th>
                  <th class="text-left">
                    {{ student.bio }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Phone</b>
                  </th>
                  <th class="text-left">
                    {{ student.phone }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Organization</b>
                  </th>
                  <th class="text-left">
                    {{ student.organization_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Grade</b>
                  </th>
                  <th class="text-left">
                    {{ student.grade_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Ziyadah Pekan Lalu ({{ student.pekan_lalu_label }})</b>
                  </th>
                  <th class="text-left">
                    {{ student.z_total_pekan_lalu }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Murojaah Pekan Lalu ({{ student.pekan_lalu_label }})</b>
                  </th>
                  <th class="text-left">
                    {{ student.m_total_pekan_lalu }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Ziyadah Pekan Ini ({{ student.pekan_ini_label }})</b>
                  </th>
                  <th class="text-left">
                    {{ student.z_total_pekan_ini }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Murojaah Pekan Ini ({{ student.pekan_ini_label }})</b>
                  </th>
                  <th class="text-left">
                    {{ student.m_total_pekan_ini }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Total Hafalan</b>
                  </th>
                  <th class="text-left">
                    {{ student.total }}
                  </th>
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>

        <v-card-item>
          <!-- ini data start -->
          <v-row>
            <v-data-table-server :headers="headers" :search="search" :items="reports" :items-length="totalItems"
              :loading="loading" v-model:options="options" @update:options="fetchData"
              v-model:items-per-page="itemsPerPage" :sort-by="[{ key: 'calories', order: 'asc' }]">
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>List Report</v-toolbar-title>
                  <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
                    hide-details></v-text-field>

                </v-toolbar>
              </template>
            </v-data-table-server>

          </v-row>

          <!-- ini data end -->
        </v-card-item>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12">
        <h1>Kelas is not found</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
import { useReportStorage } from '@/stores/reportStorage';
import { storeToRefs } from 'pinia';

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
    // start
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
    // end
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
    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Summary',
          disabled: false,
          to: { name: 'summary' }
        },
        {
          title: this.$route.params.slug,
          disabled: true,
          href: `summary/${this.$route.params.slug}`,
        }
      ]
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'Date',
            key: 'date_input',
          },
          {
            title: 'Type',
            key: 'type_report',
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
          },
          {
            title: 'Total',
            key: 'total',
          },
          {
            title: 'Organization',
            key: 'org_uuid',
          },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'Date',
            key: 'date_input',
          },
          {
            title: 'Type',
            key: 'type_report',
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
          },
          {
            title: 'Total',
            key: 'total',
          },
        ]

        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const adminHeader = [
          {
            title: 'Date',
            key: 'date_input',
          },
          {
            title: 'Type',
            key: 'type_report',
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
          },
          {
            title: 'Total',
            key: 'total',
          },
        ]

        headers = headers.concat(adminHeader)
      }

      return headers
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
        sortField: 'firstname',
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
  },
  async mounted() {
    this.slug = this.$route.params.slug;
    this.getBreadcrumbs()

    const studentStorage = useStudentStorage()
    const data = await studentStorage.showStudentByUUID(this.slug)
    this.student = data.data.student;
  }
};
</script>