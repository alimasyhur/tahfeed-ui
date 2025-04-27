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

    <v-row v-if="(kelas !== undefined)">
      <v-col cols="12">
        <v-card-item>
          <v-card-title>
            <div>
              <v-icon icon="mdi-home-account" end></v-icon>
              Kelas {{ kelas.name }}
            </div>

          </v-card-title>
          <v-card-subtitle>
            <v-table density="compact">
              <thead>
                <tr>
                  <th class="text-left">
                    <b>Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.name }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="text-left">
                    <b>Description</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.description }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Org Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.org_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Grade</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.grade_name }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Grade Year</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.grade_period }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Total Juz Target</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.total_juz_target }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Teacher NIK</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.teacher_nik }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Teacher Name</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.teacher_firstname + ' ' + kelas.teacher_lastname }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Status</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.status }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>Start Date</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.start_date }}
                  </th>
                </tr>
                <tr>
                  <th class="text-left">
                    <b>End Date</b>
                  </th>
                  <th class="text-left">
                    {{ kelas.end_date }}
                  </th>
                </tr>
              </tbody>
            </v-table>
          </v-card-subtitle>
        </v-card-item>

        <v-card-item>
          <v-data-table :headers="headers" :search="search" :items="students" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'calories', order: 'asc' }]">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>List Students</v-toolbar-title>
                <v-dialog v-model="dialog" width="auto" min-width="500" persistent>
                  <template v-slot:activator="{ props }">
                    <v-btn v-if="(kelas.status !== 'finished') && isSuperAdminOrAdminRole" class="not-uppercase"
                      color="primary" dark v-bind="props" variant="flat" size="small">
                      <v-icon>mdi-plus</v-icon> Add Student
                    </v-btn>
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
                              <v-select v-model="editedItem.student_uuid" :items="studentOptions"
                                item-title="displayText" item-value="value" label="Select Student"></v-select>
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
                <v-dialog v-model="dialogDelete" max-width="500px">
                  <v-card>
                    <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                          closable close-label="Close Alert"></v-alert>
                        <v-form v-model="form" @submit.prevent="deleteItemConfirm">
                          <p class="ma-6">Apakah Anda yakin Menghapus Student <b>{{ editedItem.name }}</b>?</p>
                          <v-row>
                            <v-col>
                              <v-btn color="success" size="large" type="submit" variant="elevated" block>
                                Ya
                              </v-btn>
                            </v-col>
                            <v-col>
                              <v-btn color="warning" size="large" type="button" variant="elevated" block
                                @click="closeDelete">Tidak
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
              <v-icon v-if="(kelas.status !== 'finished') && isSuperAdminOrAdminRole" size="small"
                @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              no data
            </template>
          </v-data-table>
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
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';

export default {
  data: () => ({
    slug: null,
    breadcrumbsItems: [
      {
        title: 'Kelas',
        disabled: false,
        href: '/kelas',
      },
    ],
    kelas: {},
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
      this.orgOptions = await this.fetchOrganizationOptions()
      this.userOptions = await this.fetchUserOrganizationOptions()
      this.studentOptions = await this.fetchStudentOptions()

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
          title: 'Kelas',
          disabled: false,
          to: { name: 'kelas' }
        },
        {
          title: this.$route.params.slug,
          disabled: true,
          href: `kelas/${this.$route.params.slug}`,
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

    async fetchUserOrganizationOptions() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)
      const userOrgStorage = useUserOrganizationStorage()

      const params = {}
      if (activeRole.value.role_name === 'Admin') {
        params.org_uuid = activeRole.value.org_uuid
      }

      const userOptionsData = await userOrgStorage.getUserOrganizationOptions(params)
      const userOptions = userOptionsData.data.map(user => {
        return {
          ...user,
          value: user.uuid,
          displayText: `${user.email} (${user.name})`
        }
      })

      return userOptions
    },

    async fetchStudentOptions() {
      const studentStorage = useStudentStorage()

      const orgUUID = this.editedItem.org_uuid;
      const params = {
        filter: {
          org_uuid: orgUUID
        }
      }

      const studentOptionsData = await studentStorage.getStudentOptions(params)
      const studentOptions = studentOptionsData.data.map(student => {
        return {
          ...student,
          value: student.uuid,
          displayText: `${student.nik} (${student.firstname} ${student.lastname})`,
        }
      })

      return studentOptions
    },

    deleteItem(item) {
      this.editedIndex = this.students.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.removeKelasStudent(this.editedItem)

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

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = this.defaultItem
    },

    closeDelete() {
      this.dialog = false
      this.dialogDelete = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    async save() {
      const orgUUID = this.kelas.org_uuid;
      const kelasUUID = this.kelas.uuid;

      this.editedItem.kelas_uuid = kelasUUID;
      this.editedItem.org_uuid = orgUUID;

      this.loading = true
      const kelasStorage = useKelasStorage()
      const respEdited = await kelasStorage.assignStudent(this.editedItem)

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

      this.loading = false
    },

  },
  async mounted() {
    this.slug = this.$route.params.slug;
    this.getBreadcrumbs()

    const kelasStorage = useKelasStorage()
    const data = await kelasStorage.showKelasByUUID(this.slug)
    this.kelas = data.data
  }
};
</script>