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

      <v-data-table :headers="headers" :search="search" :items="achievements" :items-length="totalItems"
        :loading="loading" v-model:options="options" @update:options="fetchData"
        :sort-by="[{ key: 'calories', order: 'asc' }]">
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
          <!-- <v-icon class="me-2" size="small" @click="detailReport(item.uuid)">
            mdi-eye
          </v-icon> -->
        </template>
        <template v-slot:no-data>
          no data
        </template>
      </v-data-table>

    </v-row>

  </v-container>
</template>

<script>
// import { useTeacherStorage } from '@/stores/teacherStorage';
// import { useReportStorage } from '@/stores/reportStorage';
import { useSummaryStorage } from '@/stores/summaryStorage';
// import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
// import { useOrganizationStorage } from '@/stores/organizationStorage';
// import { useGradeStorage } from '@/stores/gradeStorage';
// import { useQuranStorage } from '@/stores/quranStorage';

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
      // this.orgOptions = await this.fetchOrganizationOptions()
      // this.gradeOptions = await this.fetchGradeOptions()
      // this.teacherOptions = await this.fetchTeacherOptions()
      // this.juzOptions = await this.fetchJuzOptions()
      // this.pageOptions = await this.fetchPageOptions()
      // this.studentOptions = await this.fetchKelasStudentOptions()
      // this.typeOptions = await this.fetchReportTypeOptions()

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
      this.$router.push({ path: `/summary/${slug}` });
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
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const summaryStorage = useSummaryStorage()
      const data = await summaryStorage.getAchievement(params)

      this.achievements = data.data
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
            key: 'nis',
          },
          {
            title: 'Name',
            key: 'fullname',
          },
          {
            title: 'Total Hafalan',
            key: 'total',
          },
          {
            title: 'Grade',
            key: 'grade_name',
          },
          {
            title: 'Organization',
            key: 'organization_name',
          },
          // { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'nis',
          },
          {
            title: 'Name',
            key: 'fullname',
          },
          {
            title: 'Total Hafalan',
            key: 'total',
          },
          {
            title: 'Grade',
            key: 'grade_name',
          },
          // { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const adminHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'nis',
          },
          {
            title: 'Name',
            key: 'fullname',
          },
          {
            title: 'Total Hafalan',
            key: 'total',
          },
          {
            title: 'Grade',
            key: 'grade_name',
          },
          // { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(adminHeader)
      }

      return headers
    },
  },
}
</script>