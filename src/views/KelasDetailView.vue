<template>
  <v-container fluid class="pa-4">
    <!-- Header Section with Breadcrumbs -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="header-section">
          <v-breadcrumbs :items="breadcrumbsItems" class="pa-0 mb-4">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right" size="small"></v-icon>
            </template>
          </v-breadcrumbs>

          <div class="d-flex flex-column flex-md-row align-center justify-space-between">
            <div class="page-title-section mb-4 mb-md-0">
              <h1 class="page-title text-h4 font-weight-bold mb-2">
                <v-icon icon="mdi-google-classroom" class="mr-3" color="primary"></v-icon>
                {{ kelas?.name || 'Class Details' }}
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                {{ kelas?.description || 'Class information and student management' }}
              </p>
            </div>

            <!-- Status Badge -->
            <div class="status-section" v-if="kelas">
              <v-chip :color="getStatusColor(kelas.status)" :variant="kelas.status === 'active' ? 'elevated' : 'tonal'"
                size="large" :prepend-icon="getStatusIcon(kelas.status)" class="font-weight-medium status-chip">
                {{ formatStatus(kelas.status) }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Class Information Cards -->
    <v-row v-if="kelas" class="mb-6">
      <!-- Basic Information Card -->
      <v-col cols="12" lg="8">
        <v-card class="info-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-information" size="24" class="mr-3" color="primary"></v-icon>
              <span class="text-h6 font-weight-bold">Class Information</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-google-classroom" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">CLASS NAME</span>
                  </div>
                  <div class="info-value text-h6 font-weight-medium">{{ kelas.name }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-domain" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">ORGANIZATION</span>
                  </div>
                  <div class="info-value text-body-1">{{ kelas.org_name }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-school" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">GRADE</span>
                  </div>
                  <div class="info-value text-body-1">{{ kelas.grade_name }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-target" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">JUZ TARGET</span>
                  </div>
                  <div class="info-value text-body-1">{{ kelas.total_juz_target }} Juz</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-calendar-range" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">GRADE PERIOD</span>
                  </div>
                  <div class="info-value text-body-1">{{ kelas.grade_period }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-play" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">START DATE</span>
                  </div>
                  <div class="info-value text-body-1">{{ formatDate(kelas.start_date) }}</div>
                </div>

                <div class="info-item mb-4">
                  <div class="info-label d-flex align-center mb-2">
                    <v-icon icon="mdi-stop" size="18" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="text-caption font-weight-medium text-medium-emphasis">END DATE</span>
                  </div>
                  <div class="info-value text-body-1">{{ formatDate(kelas.end_date) }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Teacher Information Card -->
      <v-col cols="12" lg="4">
        <v-card class="teacher-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-account-tie" size="24" class="mr-3" color="secondary"></v-icon>
              <span class="text-h6 font-weight-bold">Teacher Information</span>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6 text-center">
            <v-avatar color="secondary" size="80" class="mb-4">
              <span class="text-white text-h5 font-weight-bold">
                {{ getTeacherInitials() }}
              </span>
            </v-avatar>

            <div class="teacher-name text-h6 font-weight-bold mb-2">
              {{ kelas.teacher_firstname }} {{ kelas.teacher_lastname }}
            </div>

            <v-chip color="secondary" variant="tonal" prepend-icon="mdi-card-account-details" class="mb-4">
              NIK: {{ kelas.teacher_nik }}
            </v-chip>
            <v-chip color="secondary" variant="tonal" prepend-icon="mdi-email" class="mb-4">
              Email: {{ kelas.teacher_email }}
            </v-chip>

            <div class="teacher-stats">
              <v-divider class="mb-4"></v-divider>
              <div class="d-flex justify-center">
                <div class="text-center">
                  <div class="text-h6 font-weight-bold text-primary">{{ students.length }}</div>
                  <div class="text-caption text-medium-emphasis">Students</div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Students Section -->
    <v-row v-if="kelas">
      <v-col cols="12">
        <v-card class="students-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex flex-column flex-md-row align-center justify-space-between w-100">
              <div class="d-flex align-center mb-4 mb-md-0">
                <v-icon icon="mdi-account-group" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h6 font-weight-bold">Class Students</span>
                <v-chip v-if="students.length > 0" color="primary" variant="tonal" class="ml-3">
                  {{ totalItems }} Total
                </v-chip>
              </div>

              <div class="d-flex flex-column flex-sm-row ga-3 align-center">
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search students..."
                  variant="outlined" clearable hide-details class="search-field" density="comfortable"
                  style="min-width: 250px;">
                </v-text-field>

                <v-btn v-if="kelas.status !== 'finished' && isSuperAdminOrAdminRole" color="primary" variant="elevated"
                  size="large" @click="dialog = true" class="add-student-btn" prepend-icon="mdi-account-plus">
                  <span class="d-none d-sm-inline">Add Student</span>
                  <span class="d-sm-none">Add</span>
                </v-btn>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-data-table :headers="headers" :search="search" :items="students" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'firstname', order: 'asc' }]" class="modern-table" :mobile-breakpoint="600">

            <!-- Student Name with Avatar -->
            <template v-slot:item.firstname="{ item }">
              <div class="d-flex align-center">
                <v-avatar color="primary" size="32" class="mr-3">
                  <span class="text-white text-caption font-weight-bold">
                    {{ getStudentInitials(item.firstname, item.lastname) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.firstname }} {{ item.lastname }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    NIK: {{ item.nik }}
                  </div>
                </div>
              </div>
            </template>

            <!-- NIK with Icon -->
            <template v-slot:item.nik="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-card-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.nik }}</span>
              </div>
            </template>

            <!-- NIS with Icon -->
            <template v-slot:item.nis="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-school" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.nis || 'Not Set' }}</span>
              </div>
            </template>

            <!-- Birthdate with Icon -->
            <template v-slot:item.birthdate="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ formatDate(item.birthdate) }}</span>
              </div>
            </template>

            <!-- Phone with Icon -->
            <template v-slot:item.phone="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.phone || 'Not Set' }}</span>
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <v-tooltip text="Remove Student" location="top"
                  v-if="kelas.status !== 'finished' && isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-account-remove" size="small" variant="text" color="error" @click="deleteItem(item)"
                      v-bind="props">
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <!-- Loading State -->
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
            </template>

            <!-- No Data State -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-account-group" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Students Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No students match your search criteria.' : 'This class doesn\'t have any students yet.'
                  }}
                </p>
                <v-btn v-if="!search && kelas.status !== 'finished' && isSuperAdminOrAdminRole" color="primary"
                  variant="elevated" @click="dialog = true" prepend-icon="mdi-account-plus">
                  Add First Student
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Class Not Found State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="text-center pa-8" elevation="4">
          <v-icon icon="mdi-alert-circle" size="80" color="error" class="mb-4"></v-icon>
          <h2 class="text-h4 mb-4">Class Not Found</h2>
          <p class="text-body-1 text-medium-emphasis mb-6">
            The class you're looking for doesn't exist or has been removed.
          </p>
          <v-btn color="primary" variant="elevated" to="/kelas" prepend-icon="mdi-arrow-left">
            Back to Classes
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add Student Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-plus" size="24" class="mr-3" color="primary"></v-icon>
            <span class="text-h5 font-weight-bold">{{ formTitle }}</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="close" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <v-form v-model="form" @submit.prevent="save">
            <div class="mb-4">
              <h3 class="text-h6 mb-3 d-flex align-center">
                <v-icon icon="mdi-account-search" class="mr-2"></v-icon>
                Select Student
              </h3>
              <p class="text-body-2 text-medium-emphasis mb-4">
                Choose a student from your organization to add to this class.
              </p>
            </div>

            <v-select v-model="editedItem.student_uuid" :items="studentOptions" item-title="displayText"
              item-value="value" label="Select Student" variant="outlined" prepend-inner-icon="mdi-account"
              :rules="required" clearable>
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar color="primary" size="24" class="mr-2">
                    <span class="text-white text-caption font-weight-bold">
                      {{ getInitials(item.title) }}
                    </span>
                  </v-avatar>
                  {{ item.title }}
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="32">
                      <span class="text-white font-weight-bold">
                        {{ getInitials(item.title) }}
                      </span>
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="close">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" size="large" :disabled="!form" :loading="loading" @click="save">
            Add Student
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500" persistent>
      <v-card class="modern-dialog delete-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-remove" size="24" class="mr-3" color="error"></v-icon>
            <span class="text-h5 font-weight-bold">Remove Student</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeDelete" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-alert-circle-outline" size="64" color="warning" class="mb-4"></v-icon>
            <h3 class="text-h6 mb-3">Are you sure?</h3>
            <p class="text-body-1 mb-4">
              You're about to remove <strong class="text-error">{{ editedItem.firstname }} {{ editedItem.lastname
              }}</strong> from this class.
            </p>
            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">The student will lose access to this class and its activities.</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="elevated" size="large" :loading="loading" @click="deleteItemConfirm">
            Remove Student
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.1) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 8px;
}

.page-title {
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  align-items: center;
}

.page-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
}

.status-chip {
  border-radius: 12px;
  font-size: 0.875rem;
  height: 40px;
}

.info-card,
.teacher-card,
.students-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.info-item {
  padding: 8px 0;
}

.info-label {
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: rgb(var(--v-theme-on-surface));
}

.teacher-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.search-field {
  border-radius: 12px;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.add-student-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.add-student-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modern-table :deep(.v-data-table__wrapper) {
  border-radius: 0;
}

.modern-table :deep(.v-data-table-header) {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
}

.modern-table :deep(.v-data-table-header th) {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgba(var(--v-theme-primary), 0.1);
}

.modern-table :deep(.v-data-table__tr:hover) {
  background: rgba(var(--v-theme-primary), 0.02);
}

.action-buttons-cell {
  display: flex;
  gap: 4px;
}

.modern-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.delete-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.05) 0%, rgba(var(--v-theme-warning), 0.02) 100%);
}

.modern-dialog :deep(.v-field) {
  border-radius: 12px;
}

.modern-dialog :deep(.v-btn) {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .modern-dialog {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }

  .info-card .pa-6 {
    padding: 16px !important;
  }
}

/* Dark mode adjustments */
.v-theme--dark .info-card,
.v-theme--dark .teacher-card,
.v-theme--dark .students-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

/* Custom scrollbar */
:deep(.v-data-table__wrapper) {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 4px;
}

:deep(.v-data-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>

<script>
import { useKelasStorage } from '@/stores/kelasStorage';
import { useStudentStorage } from '@/stores/studentStorage';
import { useUserStorage } from '@/stores/userStorage';
import { storeToRefs } from 'pinia';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';
import moment from 'moment';

export default {
  data: () => ({
    slug: null,
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Classes',
        disabled: false,
        href: '/kelas',
      },
    ],
    kelas: null,
    users: [],
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        title: 'Student',
        align: 'start',
        key: 'firstname',
        width: '200px'
      },
      {
        title: 'NIK',
        key: 'nik',
        width: '150px'
      },
      {
        title: 'NIS',
        key: 'nis',
        width: '120px'
      },
      {
        title: 'Birthdate',
        key: 'birthdate',
        width: '130px'
      },
      {
        title: 'Phone',
        key: 'phone',
        width: '150px'
      },
      {
        title: 'Actions',
        key: 'actions',
        sortable: false,
        width: '100px',
        align: 'center'
      },
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
    alertMessage: 'An error occurred',
    hasAlert: false,
    alertType: null,
    form: false,
    required: [
      v => v !== null && v !== undefined && v !== '' || 'This field is required'
    ],
    activeRole: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Add New Student' : 'Edit Student'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.students.filter(student =>
        Object.values(student).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    async dialog(val) {
      if (val) {
        this.orgOptions = await this.fetchOrganizationOptions()
        this.userOptions = await this.fetchUserOrganizationOptions()
        this.studentOptions = await this.fetchStudentOptions()
      } else {
        this.close()
      }
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
    // Helper methods for UI
    getInitials(name) {
      if (!name) return ''
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },

    getStudentInitials(firstname, lastname) {
      const first = firstname ? firstname[0] : '';
      const last = lastname ? lastname[0] : '';
      return (first + last).toUpperCase();
    },

    getTeacherInitials() {
      if (!this.kelas) return '';
      const first = this.kelas.teacher_firstname ? this.kelas.teacher_firstname[0] : '';
      const last = this.kelas.teacher_lastname ? this.kelas.teacher_lastname[0] : '';
      return (first + last).toUpperCase();
    },

    getStatusColor(status) {
      const colors = {
        'not_started': 'grey',
        'active': 'success',
        'finished': 'info',
        'paused': 'warning'
      };
      return colors[status] || 'grey';
    },

    getStatusIcon(status) {
      const icons = {
        'not_started': 'mdi-pause',
        'active': 'mdi-play',
        'finished': 'mdi-check',
        'paused': 'mdi-pause'
      };
      return icons[status] || 'mdi-help';
    },

    formatStatus(status) {
      const statusMap = {
        'not_started': 'Not Started',
        'active': 'Active',
        'finished': 'Finished',
        'paused': 'Paused'
      };
      return statusMap[status] || status;
    },

    formatDate(date) {
      if (!date) return 'Not Set';
      return moment(date).format('DD MMM YYYY');
    },

    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Dashboard',
          disabled: false,
          href: '/dashboard'
        },
        {
          title: 'Classes',
          disabled: false,
          href: '/kelas'
        },
        {
          title: this.kelas?.name || this.$route.params.slug,
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
      this.totalItems = data.total || data.data.length
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
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      const orgUUID = activeRole.value.org_uuid;
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
      this.loading = true
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.removeKelasStudent(this.editedItem)

      this.alertMessage = respDelete.message
      this.hasAlert = true
      this.alertType = respDelete.status

      if (respDelete.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogDelete = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeDelete()
        }, 700)
      }
      this.loading = false
    },

    close() {
      this.dialog = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeDelete() {
      this.dialogDelete = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      if (!this.kelas) return;

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
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.close()
        }, 500)
      }

      this.loading = false
    },
  },

  async mounted() {
    this.slug = this.$route.params.slug;

    const kelasStorage = useKelasStorage()
    try {
      const data = await kelasStorage.showKelasByUUID(this.slug)
      this.kelas = data.data
      this.getBreadcrumbs()
      // Fetch initial data after kelas is loaded
      this.fetchData()
    } catch (error) {
      console.error('Failed to load class:', error)
      this.kelas = null
    }
  }
}
</script>