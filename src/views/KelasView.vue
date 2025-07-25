<template>
  <v-container>
    <!-- <v-row>
      <v-col cols="12">
        <h1>Role</h1>
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

      <v-data-table :headers="headers" :search="search" :items="kelases" :items-length="totalItems" :loading="loading"
        v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'calories', order: 'asc' }]">
        <template v-slot:top>
          <v-toolbar flat>
            <v-dialog v-model="dialog" width="auto" persistent>
              <template v-slot:activator="{ props }">
                <v-btn v-if="isSuperAdminOrAdminRole" class="not-uppercase" color="primary" dark v-bind="props"
                  variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New Kelas
                </v-btn>
              </template>
              <v-card class="responsive-dialog" :title="formTitle">
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="save">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.name" :rules="required" label="Name" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.description" :rules="required" label="Description"
                            type="text" :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.total_juz_target" :rules="required" label="Total Juz Target"
                            type="number" :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="editedItem.teacher_uuid" :items="teacherOptions" item-title="displayText"
                            item-value="value" label="Select Teacher"></v-select>
                        </v-col>
                        <v-col cols="12" v-if="isSuperAdminRole">
                          <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText"
                            item-value="value" label="Select Organization"></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="editedItem.grade_uuid" :items="gradeOptions" item-title="displayText"
                            item-value="value" label="Select Grade"></v-select>
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
            <v-dialog v-model="dialogDelete" width="auto" persistent>
              <v-card class="responsive-dialog">
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="deleteItemConfirm">
                      <p class="ma-6">Apakah Anda yakin Menghapus Kelas <b>{{ editedItem.name }}</b>?</p>
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

            <v-dialog v-model="dialogStart" width="auto" persistent>
              <v-card class="responsive-dialog">
                <v-card-title class="text-h5">Are you sure want to start this class?</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="startItemConfirm">
                      <p class="ma-6">Dengan memulai kelas ini, maka Anda mengijinkan aktifitas kelas dapat dimulai.
                        Apakah Anda yakin akan memulai Kelas <b>{{ editedItem.name }}</b> ini?</p>
                      <v-row>
                        <v-col>
                          <v-btn color="success" size="large" type="submit" variant="elevated" block>
                            Ya
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="warning" size="large" type="button" variant="elevated" block
                            @click="closeStart">Tidak
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogEnd" width="auto" persistent>
              <v-card class="responsive-dialog">
                <v-card-title class="text-h5">Are you sure want to end this class?</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="endItemConfirm">
                      <p class="ma-6">Dengan mengakhiri kelas ini, maka Anda sudah tidak dapat melakukan aktifitas di
                        kelas ini.
                        Apakah Anda yakin akan mengakhiri Kelas <b>{{ editedItem.name }}</b> ini?</p>
                      <v-row>
                        <v-col>
                          <v-btn color="success" size="large" type="submit" variant="elevated" block>
                            Ya
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="warning" size="large" type="button" variant="elevated" block
                            @click="closeEnd">Tidak
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogReactivate" width="auto" persistent>
              <v-card class="responsive-dialog">
                <v-card-title class="text-h5">Are you sure want to reactivate this class?</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="reactivateItemConfirm">
                      <p class="ma-6">Dengan mengaktifkan kembali kelas ini, maka Anda dapat melakukan aktifitas kembali
                        di
                        kelas ini.
                        Apakah Anda yakin akan mengaktifkan kembali Kelas <b>{{ editedItem.name }}</b> ini?</p>
                      <v-row>
                        <v-col>
                          <v-btn color="success" size="large" type="submit" variant="elevated" block>
                            Ya
                          </v-btn>
                        </v-col>
                        <v-col>
                          <v-btn color="warning" size="large" type="button" variant="elevated" block
                            @click="closeReactivate">Tidak
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-spacer></v-spacer>

            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line
              hide-details></v-text-field>

          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon v-if="(item.status === 'not_started') && isSuperAdminOrAdminRole" class="me-2" size="small"
            @click="startItem(item)">
            mdi-play
          </v-icon>
          <v-icon v-if="(item.status === 'finished') && isSuperAdminOrAdminRole" class="me-2" size="small"
            @click="reactivateItem(item)">
            mdi-replay
          </v-icon>
          <v-icon v-if="(item.status === 'active') && isSuperAdminOrAdminRole" class="me-2" size="small"
            @click="endItem(item)">
            mdi-stop
          </v-icon>
          <v-icon class="me-2" size="small" @click="detailKelas(item.uuid)">
            mdi-eye
          </v-icon>
          <v-icon v-if="isSuperAdminOrAdminRole" class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon v-if="(item.status === 'not_started') && isSuperAdminOrAdminRole" size="small"
            @click="deleteItem(item)">
            mdi-delete
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
import { useKelasStorage } from '@/stores/kelasStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useGradeStorage } from '@/stores/gradeStorage';
import moment from 'moment';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dialogStart: false,
    dialogEnd: false,
    dialogReactivate: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Kelas',
        disabled: true,
        href: 'kelas',
      }
    ],
    kelases: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
      total_juz_target: null,
    },
    defaultItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
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
      return this.editedIndex === -1 ? 'New Kelas' : 'Edit Kelas'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.kelases.filter(kelas =>
        Object.values(kelas).some(val =>
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

      return val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    dialogStart(val) {
      val || this.closeStart()
    },
    dialogEnd(val) {
      val || this.closeEnd()
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
    detailKelas(slug) {
      this.$router.push({ path: `/kelas/${slug}` });
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

      const kelasStorage = useKelasStorage()
      const data = await kelasStorage.getKelases(params)

      this.kelases = data.data
      this.totalItems = data.data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'Name',
            align: 'start',
            key: 'name',
          },
          {
            title: 'Description',
            key: 'description',
          },
          {
            title: 'Period',
            key: 'period',
          },
          {
            title: 'Status',
            key: 'status',
          },
          {
            title: 'Organization',
            key: 'org_name',
          },
          { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'Name',
            align: 'start',
            key: 'name',
          },
          {
            title: 'Description',
            key: 'description',
          },
          {
            title: 'Period',
            key: 'period',
          },
          {
            title: 'Status',
            key: 'status',
          },
          { title: 'Actions', key: 'actions', sortable: false },
        ]

        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const adminHeader = [
          {
            title: 'Name',
            align: 'start',
            key: 'name',
          },
          {
            title: 'Description',
            key: 'description',
          },
          {
            title: 'Period',
            key: 'period',
          },
          {
            title: 'Status',
            key: 'status',
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

    editItem(item) {
      this.editedIndex = this.kelases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.kelases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    startItem(item) {
      this.editedIndex = this.kelases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogStart = true
    },

    endItem(item) {
      this.editedIndex = this.kelases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogEnd = true
    },

    reactivateItem(item) {
      this.editedIndex = this.kelases.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogReactivate = true
    },

    async deleteItemConfirm() {
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.removeKelas(this.editedItem)

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

    async startItemConfirm() {
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.startKelas(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.dialogStart = false
          this.dialogReactivate = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = this.defaultItem
          this.closeStart()
        }, 700)
      }
    },

    async endItemConfirm() {
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.endKelas(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.dialogStart = false
          this.dialogReactivate = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = this.defaultItem
          this.closeStart()
        }, 700)
      }
    },

    async reactivateItemConfirm() {
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.reactivateKelas(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialog = false
          this.dialogDelete = false
          this.dialogStart = false
          this.dialogReactivate = false
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

    closeStart() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogStart = false
      this.dialogEnd = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    closeEnd() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogStart = false
      this.dialogEnd = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    closeReactivate() {
      this.dialog = false
      this.dialogDelete = false
      this.dialogStart = false
      this.dialogEnd = false
      this.dialogReactivate = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedItem = this.defaultItem
    },

    async save() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.constant_value === 2) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        this.loading = true
        const kelasStorage = useKelasStorage()
        const respEdited = await kelasStorage.editKelas(this.editedItem)

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
        this.loading = true
        const kelasStorage = useKelasStorage()
        const respEdited = await kelasStorage.addKelas(this.editedItem)

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