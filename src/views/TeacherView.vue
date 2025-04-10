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
      <v-data-table :headers="headers" :search="search" :items="teachers" :items-length="totalItems" :loading="loading"
        v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'calories', order: 'asc' }]">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List Teachers</v-toolbar-title>
            <v-dialog v-model="dialog" width="auto" min-width="500" persistent>
              <template v-slot:activator="{ props }">
                <v-btn v-if="isSuperAdminOrAdminRole" class="not-uppercase" color="primary" dark v-bind="props"
                  variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New Teacher
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
                          <v-text-field v-model="editedItem.nik" :rules="required" label="NIK" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.firstname" :rules="required" label="First Name" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.lastname" :rules="required" label="Last Name" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <VueDatePicker v-model="editedItem.birthdate" :rules="required" placeholder="Select Birthdate"
                            label="Select Birthdate" :enable-time-picker="false" :format="formattedDate">
                          </VueDatePicker>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.phone" :rules="required" label="Phone" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="editedItem.bio" :rules="required" label="Bio" type="text"
                            :loading="loading" clearable></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="editedItem.user_uuid" :items="userOptions" item-title="displayText"
                            item-value="value" label="Select User"></v-select>
                        </v-col>
                        <v-col cols="12" v-if="isSuperAdminRole">
                          <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText"
                            item-value="value" label="Select Organization"></v-select>
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
                      <p class="ma-6">Apakah Anda yakin Menghapus Teacher <b>{{ editedItem.name }}</b>?</p>
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
          <v-icon v-if="isSuperAdminOrAdminRole" class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon v-if="isSuperAdminOrAdminRole" size="small" @click="deleteItem(item)">
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
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Teachers',
        disabled: true,
        href: 'teacher',
      }
    ],
    teachers: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      user_uuid: '',
      org_uuid: '',
      org_name: '',
      nik: '',
      firstname: '',
      lastname: '',
      birthdate: null,
      phone: '',
      bio: '',
    },
    defaultItem: {
      uuid: '',
      user_uuid: '',
      org_uuid: '',
      org_name: '',
      nik: '',
      firstname: '',
      lastname: '',
      birthdate: null,
      phone: '',
      bio: '',
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
      return this.editedIndex === -1 ? 'New Teacher' : 'Edit Teacher'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.teachers.filter(teacher =>
        Object.values(teacher).some(val =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    formattedDate() {
      const date = new Date(this.editedItem.birthdate)
      if (!date) return ''
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
  },

  watch: {
    async dialog(val) {
      this.orgOptions = await this.fetchOrganizationOptions()
      this.userOptions = await this.fetchUserOrganizationOptions()

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
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const teacherStorage = useTeacherStorage()
      const data = await teacherStorage.getTeachers(params)

      this.teachers = data.data
      this.totalItems = data.data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'NIK',
            align: 'start',
            key: 'nik',
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
            title: 'NIK',
            align: 'start',
            key: 'nik',
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
        ]

        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const adminHeader = [
          {
            title: 'NIK',
            align: 'start',
            key: 'nik',
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

    editItem(item) {
      this.editedIndex = this.teachers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.teachers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const teacherStorage = useTeacherStorage()
      const respDelete = await teacherStorage.removeTeacher(this.editedItem)

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
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      if (activeRole.value.constant_value === 2) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        this.loading = true
        const teacherStorage = useTeacherStorage()
        const respEdited = await teacherStorage.editTeacher(this.editedItem)

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
        const teacherStorage = useTeacherStorage()
        const respEdited = await teacherStorage.addTeacher(this.editedItem)

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
  async mounted() {
  }
}
</script>