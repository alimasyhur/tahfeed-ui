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

      <v-data-table :headers="headers" :search="search" :items="grades" :items-length="totalItems" :loading="loading"
        v-model:options="options" @update:options="fetchData" :sort-by="[{ key: 'calories', order: 'asc' }]">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>List Grades</v-toolbar-title>
            <v-dialog v-model="dialog" width="auto" persistent>
              <template v-slot:activator="{ props }">
                <v-btn class="not-uppercase" color="primary" dark v-bind="props" variant="flat" size="small">
                  <v-icon>mdi-plus</v-icon> New Grade
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
                          <!-- <v-text-field v-model="editedItem.period" :rules="required" label="Tahun Angkatan" type="text"
                            :loading="loading" clearable></v-text-field> -->

                          <VueDatePicker v-model="editedItem.period" :rules="required" placeholder="Select Angkatan"
                            year-picker :format="formattedYear">
                          </VueDatePicker>

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
            <v-dialog v-model="dialogDelete" width="auto">
              <v-card class="responsive-dialog">
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-text>
                  <v-container>
                    <v-alert v-if="hasAlert" density="compact" :text="alertMessage" :type="alertType" class="my-3"
                      closable close-label="Close Alert"></v-alert>
                    <v-form v-model="form" @submit.prevent="deleteItemConfirm">
                      <p class="ma-6">Apakah Anda yakin Menghapus Grade <b>{{ editedItem.name }}</b>?</p>
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
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)">
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

<style scoped>
.responsive-dialog {
  width: 90vw;
  max-width: 500px;
  margin: 0 auto;
}
</style>

<script>
import { useGradeStorage } from '@/stores/gradeStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Grades',
        disabled: true,
        href: 'grade',
      }
    ],
    grades: [],
    editedIndex: -1,
    editedItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
    },
    defaultItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
    },
    search: '',
    totalItems: 0,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    isSuperAdminRole: false,
    orgOptions: [],
    loading: false,
    alertMessage: 'Terjadi Kesalahan',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => !!v || 'Field is required'
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Grade' : 'Edit Grade'
    },
    validForm() {
      return this.$refs.form.$valid;
    },
    filteredItems() {
      return this.grades.filter(grade =>
        Object.values(grade).some(val =>
          val.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    formattedYear() {
      if (this.editedItem.period == '') return ''

      const date = new Date(this.editedItem.period, 0, 1)
      if (!date) return ''
      const year = date.getFullYear()

      return `${year}`
    }
  },

  watch: {
    async dialog(val) {
      this.orgOptions = await this.fetchOrganizationOptions()
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
      const { isSuperAdmin } = userStorage
      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'name',
      };

      this.isSuperAdminRole = isSuperAdmin(activeRole.value)

      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
        }
      }

      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const gradeStorage = useGradeStorage()
      const data = await gradeStorage.getGrades(params)

      this.grades = data.data
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

    editItem(item) {
      this.editedIndex = this.grades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.grades.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    async deleteItemConfirm() {
      const gradeStorage = useGradeStorage()
      const respDelete = await gradeStorage.removeGrade(this.editedItem)

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
        const gradeStorage = useGradeStorage()
        const respEdited = await gradeStorage.editGrade(this.editedItem)

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
        const gradeStorage = useGradeStorage()
        const respEdited = await gradeStorage.addGrade(this.editedItem)

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