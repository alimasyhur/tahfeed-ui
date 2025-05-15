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
import { useKelasStorage } from '@/stores/kelasStorage';
import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
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
    headers: [
      {
        title: 'NIK',
        align: 'start',
        key: 'nik',
      },
      {
        title: 'NIS',
        key: 'nis',
      },
      {
        title: 'First Name',
        key: 'firstname',
      },
      {
        title: 'Last Name',
        key: 'lastname',
      },
      {
        title: 'Birthdate',
        key: 'birthdate',
      },
      {
        title: 'Phone',
        key: 'phone',
      },
      { title: 'Actions', key: 'actions', sortable: false },
    ],
    students: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      name: '',
      description: '',
      teacher_uuid: '',
      org_uuid: '',
      grade_uuid: '',
      status: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_uuid: '',
      nik: '',
      nis: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      phone: '',
      total_juz_target: null,
    },
    defaultItem: {
      uuid: '',
      name: '',
      description: '',
      teacher_uuid: '',
      org_uuid: '',
      grade_uuid: '',
      status: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_uuid: '',
      nik: '',
      nis: '',
      firstname: '',
      lastname: '',
      birthdate: '',
      phone: '',
      total_juz_target: null,
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
        kelas_uuid: this.$route.params.slug
      }

      const kelasStorage = useKelasStorage()
      const data = await kelasStorage.getKelasStudents(params)

      this.students = data.data
      this.totalItems = data.data.total
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