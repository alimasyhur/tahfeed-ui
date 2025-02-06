<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12">
        <h1>Report</h1>
      </v-col>
    </v-row> -->

    <v-row>
      <div>
        <v-breadcrumbs :items="breadcrumbsItems">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
    </v-row>


    <v-row>

      <v-data-table :headers="headers" :search="search" :items="reports" :items-length="totalItems" :loading="loading"
        v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'calories', order: 'asc' }]">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List Summary</v-toolbar-title>
            <v-dialog v-model="dialog" width="auto" min-width="500" persistent>
              <template v-slot:activator="{ props }">
                <!-- <v-btn class="not-uppercase" color="primary" dark v-bind="props" variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New Summary
                </v-btn> -->
              </template>
              <v-card>
                <v-card :title="formTitle"></v-card>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="save">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.date_input" :rules="required" label="Date Input" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="editedItem.student_uuid" :items="studentOptions" item-title="displayText"
                            item-value="value" label="Select Student" clearable />
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="editedItem.type_report" :items="typeOptions" item-title="displayText"
                            item-value="value" label="Select Type" clearable />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.note" :rules="required" label="Note" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="selectedStartJuz" :items="juzOptions" item-title="displayText"
                            item-value="value" label="Select Juz" @change="onJuzChange" clearable />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="selectedStartPage" :items="pageOptions" item-title="displayText"
                            item-value="value" label="Select Page" :disabled="!selectedStartJuz" clearable />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="selectedEndJuz" :items="juzOptions" item-title="displayText"
                            item-value="value" label="Select Juz" :disabled="!selectedStartPage"
                            @change="onJuzEndChange" clearable />
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-select v-model="selectedEndPage" :items="pageOptions" item-title="displayText"
                            item-value="value" label="Select Page" :disabled="!selectedEndJuz" clearable />
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-btn color="success" size="large" type="submit" variant="elevated" :disabled="!form"
                            block>Save
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="warning" size="large" type="button" variant="elevated" block
                            @click="close">Cancel
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

              </v-card>
            </v-dialog>

            <v-divider class="mx-4" vertical></v-divider>
            <v-spacer></v-spacer>

            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
              hide-details></v-text-field>

          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="detailReport(item.uuid)">
            mdi-eye
          </v-icon>
        </template>
        <template v-slot:no-data>
          no data
        </template>
      </v-data-table>

    </v-row>

  </v-container>
</template>

<script>
import { useTeacherStorage } from '@/stores/teacherStorage';
import { useReportStorage } from '@/stores/reportStorage';
import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useGradeStorage } from '@/stores/gradeStorage';
import { useQuranStorage } from '@/stores/quranStorage';

export default {
  data: () => ({
    // coba
    juzOptions: [],
    juzPageOptions: [],
    studentOptions: [],
    selectedStartJuz: null,
    selectedStartPage: null,
    selectedEndJuz: null,
    selectedEndPage: null,
    typeOptions: [],
    // coba end

    // test
    selectedCategory: null,
    selectedItem: null,
    categories: [
      { id: 1, name: 'Category 1' },
      { id: 2, name: 'Category 2' },
      { id: 3, name: 'Category 3' },
    ],
    items: [
      { id: 1, name: 'Item 1', categoryId: 1 },
      { id: 2, name: 'Item 2', categoryId: 1 },
      { id: 3, name: 'Item 3', categoryId: 2 },
      { id: 4, name: 'Item 4', categoryId: 2 },
      { id: 5, name: 'Item 5', categoryId: 3 },
    ],
    // test end
    dialog: false,
    dialogDelete: false,
    dialogLock: false,
    dialogUnlock: false,
    dialogEnd: false,
    dialogReactivate: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Summary',
        disabled: true,
        href: 'summary',
      }
    ],
    reports: [],
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
    alertMessage: 'Terjadi Kesalahan',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => !!v || 'Field is required'
    ],
    activeRole: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Report' : 'Edit Report'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.reports.filter(report =>
        Object.values(report).some(val =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    async dialog(val) {
      this.orgOptions = await this.fetchOrganizationOptions()
      this.gradeOptions = await this.fetchGradeOptions()
      this.teacherOptions = await this.fetchTeacherOptions()
      this.juzOptions = await this.fetchJuzOptions()
      this.pageOptions = await this.fetchPageOptions()
      this.studentOptions = await this.fetchKelasStudentOptions()
      this.typeOptions = await this.fetchReportTypeOptions()

      return val || this.close()
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
      async handler() {
        // this.fetchData();
      },
      deep: true,
    },
  },

  methods: {
    onJuzChange() {
      this.selectedStartPage = null;
    },
    onJuzEndChange() {
      this.selectedEndPage = null;
    },
    onCategoryChange() {
      this.selectedItem = null;
    },
    detailReport(slug) {
      this.$router.push({ path: `/report/${slug}` });
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
        params.filter = Object.values({
          org_uuid: activeRole.value.org_uuid
        })
      }

      if (activeRole.value.constant_value === 3) {
        const query = {
          org_uuid: activeRole.value.org_uuid,
          teacher_uuid: activeRole.value.teacher_uuid,
        }
        params.filter = query
      }

      this.activeRole = activeRole.value
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const reportStorage = useReportStorage()
      const data = await reportStorage.getReports(params)

      this.reports = data.data
      this.totalItems = data.data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'student_nis',
          },
          {
            title: 'Name',
            key: 'student_fullname',
          },
          {
            title: 'Total',
            key: 'total',
          },
          {
            title: 'Organization',
            key: 'org_uuid',
          },
          { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'Name',
            key: 'student_fullname',
          },
          {
            title: 'Total',
            key: 'total',
          },
          { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const adminHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'student_nis',
          },
          {
            title: 'Name',
            key: 'student_fullname',
          },
          {
            title: 'Total',
            key: 'total',
          },
          { title: 'Actions', key: 'actions', sortable: false },
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

    async fetchTeacherOptions() {
      const teacherStorage = useTeacherStorage()
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const params = {};
      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
        }
      }

      const orgOptionsData = await teacherStorage.getTeachers(params);
      const teacherOptions = orgOptionsData.data.map(teacher => {
        return {
          ...teacher,
          value: teacher.uuid,
          displayText: `${teacher.firstname} ${teacher.lastname} (${teacher.nik})`,
        }
      })

      return teacherOptions
    },

    async fetchKelasStudentOptions() {
      const studentStorage = useStudentStorage()
      const userStorage = useUserStorage()
      const { me, activeRole } = storeToRefs(userStorage)

      console.log('wkwkwk')
      console.log('me: ', me)
      console.log('fetch active role teacher_uuid: ', activeRole.value.teacher_uuid)
      console.log('fetch active role kelas_uuid: ', me.value.kelas.uuid)
      console.log('fetch active role org_uuid: ', me.value.kelas.org_uuid)

      const params = {
        limit: 100000,
        sortOrder: '1',
        sortField: 'period',
      };

      params.filter = {
        org_uuid: activeRole.value.org_uuid,
        kelas_uuid: me.value.kelas.uuid,
      }

      const studentOptionsData = await studentStorage.getKelasStudentOptions(params)
      const studentOptions = studentOptionsData.data.map(student => {
        const textToDisplay = `${student.firstname} ${student.lastname} (${student.nik})`
        return {
          ...student,
          value: student.uuid,
          displayText: textToDisplay,
        }
      })

      return studentOptions
    },

    async fetchReportTypeOptions() {
      return [
        {
          value: 'ziyadah',
          displayText: 'ziyadah',
        },
        {
          value: 'murojaah',
          displayText: 'murojaah',
        },
      ];
    },

    async fetchGradeOptions() {
      const gradeStorage = useGradeStorage()
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const params = {
        limit: 100000,
        sortOrder: '1',
        sortField: 'period',
      };

      params.filter = {
        org_uuid: activeRole.value.org_uuid,
      }

      const gradeOptionsData = await gradeStorage.getGrades(params)
      const gradeOptions = gradeOptionsData.data.map(org => {
        return {
          ...org,
          value: org.uuid,
          displayText: org.name,
        }
      })

      return gradeOptions
    },

    async fetchJuzOptions() {
      const quranStorage = useQuranStorage()
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.constant_value === 2) {
        return [{
          value: activeRole.value.org_uuid,
          displayText: activeRole.value.org_name,
        }]
      }

      const quranOptionsData = await quranStorage.getJuzes()

      const juzOptions = quranOptionsData.data.map(juz => {
        return {
          ...juz,
          value: juz.uuid,
          displayText: juz.name,
        }
      })

      return juzOptions
    },

    async fetchPageOptions() {
      const quranStorage = useQuranStorage()
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.constant_value === 2) {
        return [{
          value: activeRole.value.org_uuid,
          displayText: activeRole.value.org_name,
        }]
      }

      const quranOptionsData = await quranStorage.getPages()

      const pageOptions = quranOptionsData.data.map(page => {
        return {
          ...page,
          value: page.uuid,
          displayText: page.name,
        }
      })

      return pageOptions
    },

    editItem(item) {
      this.editedIndex = this.reports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.reports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    lockItem(item) {
      this.editedIndex = this.reports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogLock = true
    },

    unlockItem(item) {
      this.editedIndex = this.reports.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogUnlock = true
    },

    async deleteItemConfirm() {
      const reportStorage = useReportStorage()
      const respDelete = await reportStorage.removeReport(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = this.defaultItem
          this.closeDelete()
        }, 700)
      }
    },

    async lockItemConfirm() {
      const reportStorage = useReportStorage()
      const respLock = await reportStorage.lockReport(this.editedItem)

      this.alertMessage = respLock.message
      this.hasAlert = true
      this.alertType = respLock.status

      if (respLock.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.dialogLock = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = this.defaultItem
          this.closeStart()
        }, 700)
      }
    },

    async unlockItemConfirm() {
      const reportStorage = useReportStorage()
      const respUnlock = await reportStorage.unlockReport(this.editedItem)

      this.alertMessage = respUnlock.message
      this.hasAlert = true
      this.alertType = respUnlock.status

      if (respUnlock.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.dialogLock = false
          this.dialogUnlock = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = this.defaultItem
          this.closeStart()
        }, 700)
      }
    },

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = this.defaultItem
      this.selectedStartJuz = ''
      this.selectedStartPage = ''
      this.selectedEndJuz = ''
      this.selectedEndPage = ''
    },

    closeDelete() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogStart = false
      this.dialogEnd = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    closeLock() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogLock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    closeUnlock() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogLock = false
      this.dialogUnlock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    async save() {
      const userStorage = useUserStorage()
      const { me, activeRole } = storeToRefs(userStorage)

      if ([2, 3].includes(activeRole.value.constant_value)) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        this.loading = true
        const reportStorage = useReportStorage()
        const respEdited = await reportStorage.editReport(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          this.fetchData()
          setTimeout(() => {
            this.dialog = false
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

        console.log('cek activeRole: ', activeRole.value)
        console.log('cek me: ', me.value)
        const kelasData = me.value.kelas

        console.log('cek activeRole.teacher_uuid: ', activeRole.value.teacher_uuid)
        console.log('cek activeRole.constant_value: ', activeRole.value.constant_value)
        console.log('select2 this.selectedStartJuz: ', this.selectedStartJuz)
        console.log('select2 this.selectedStartPage: ', this.selectedStartPage)
        console.log('select2 this.selectedEndJuz: ', this.selectedEndJuz)
        console.log('select2 this.selectedEndPage: ', this.selectedEndPage)

        this.loading = true
        const reportStorage = useReportStorage()

        this.editedItem.teacher_uuid = kelasData.teacher_uuid
        this.editedItem.start_juz_uuid = this.selectedStartJuz
        this.editedItem.start_page_uuid = this.selectedStartPage
        this.editedItem.end_juz_uuid = this.selectedEndJuz
        this.editedItem.end_page_uuid = this.selectedEndPage
        this.editedItem.kelas_uuid = me.value.kelas.uuid

        console.log('payload: ', this.editedItem)

        const respEdited = await reportStorage.addReport(this.editedItem)

        this.alertMessage = respEdited.message
        this.hasAlert = true
        this.alertType = respEdited.status

        if (respEdited.status == "success") {
          this.fetchData()
          setTimeout(() => {
            this.dialog = false
            this.dialogDelete = false
            this.alertMessage = ''
            this.hasAlert = false
            this.alertType = ''
            this.editedIndex = -1
            this.editedItem = this.defaultItem
            this.close()
          }, 500)
        }

      }

      this.loading = false
    },
  },
  // async mounted() {
  // this.fetchData()
  // }
}
</script>