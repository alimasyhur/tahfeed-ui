<template>
  <v-container fluid class="pa-4">
    <!-- Header Section with Gradient Background -->
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
                <v-icon icon="mdi-clipboard-text" class="mr-3" color="primary"></v-icon>
                Report Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage student reports, progress tracking, and assessments
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn v-if="isTeacherRole" color="primary" variant="elevated" size="large" @click="dialog = true"
                class="action-btn" prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Report</span>
                <span class="d-sm-none">New</span>
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Statistics Section -->
    <v-row class="mb-4">
      <v-col cols="12" md="8" lg="6">
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search reports..." variant="outlined"
          clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="reports.length > 0" color="primary" variant="tonal" prepend-icon="mdi-clipboard-text-multiple">
          {{ totalItems }} Total Reports
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table-server :headers="headers" :search="search" :items="reports" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'date_input', order: 'desc' }]" class="modern-table" :mobile-breakpoint="600">

            <!-- Student NIS with Icon -->
            <template v-slot:item.student_nis="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-card-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span class="font-mono">{{ item.student_nis }}</span>
              </div>
            </template>

            <!-- Date with Icon and Formatting -->
            <template v-slot:item.date_input="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ formatDate(item.date_input) }}</span>
              </div>
            </template>

            <!-- Student Name with Avatar -->
            <template v-slot:item.student_fullname="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getAvatarColor(item.student_fullname)" size="32" class="mr-3">
                  <span class="text-white font-weight-bold">
                    {{ getInitials(item.student_fullname) }}
                  </span>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.student_fullname }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    NIS: {{ item.student_nis }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Type Report with Chip -->
            <template v-slot:item.type_report="{ item }">
              <v-chip :color="item.type_report === 'ziyadah' ? 'success' : 'info'" variant="tonal" size="small"
                class="text-capitalize">
                {{ item.type_report }}
              </v-chip>
            </template>

            <!-- Start Page with Icon -->
            <template v-slot:item.start_juz_page_name="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-book-open-page-variant" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.start_juz_page_name || 'N/A' }}</span>
              </div>
            </template>

            <!-- End Page with Icon -->
            <template v-slot:item.end_juz_page_name="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-book-open-page-variant" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.end_juz_page_name || 'N/A' }}</span>
              </div>
            </template>

            <!-- Total with Badge -->
            <template v-slot:item.total="{ item }">
              <v-chip color="primary" variant="outlined" size="small">
                {{ item.total || '0' }}
              </v-chip>
            </template>

            <!-- Organization (Super Admin only) -->
            <template v-slot:item.org_uuid="{ item }">
              <div class="d-flex align-center">
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                {{ item.org_name || 'N/A' }}
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell">
                <!-- Lock/Unlock Button -->
                <v-tooltip :text="item.is_locked ? 'Unlock Report' : 'Lock Report'" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn :icon="item.is_locked ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'" size="small"
                      variant="text" :color="item.is_locked ? 'error' : 'success'"
                      @click="item.is_locked ? unlockItem(item) : lockItem(item)" v-bind="props">
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Edit Button -->
                <v-tooltip text="Edit Report" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-if="!item.is_locked" icon="mdi-pencil" size="small" variant="text" color="primary"
                      @click="editItem(item)" v-bind="props">
                    </v-btn>
                  </template>
                </v-tooltip>

                <!-- Delete Button -->
                <v-tooltip text="Delete Report" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn v-if="!item.is_locked" icon="mdi-delete" size="small" variant="text" color="error"
                      @click="deleteItem(item)" v-bind="props">
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
            </template>

            <!-- Loading State -->
            <template v-slot:loading>
              <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
            </template>

            <!-- No Data State -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon icon="mdi-clipboard-text-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Reports Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No reports match your search criteria.' : 'Get started by creating your first report.' }}
                </p>
                <v-btn v-if="!search && isTeacherRole" color="primary" variant="elevated" @click="dialog = true"
                  prepend-icon="mdi-plus">
                  Create First Report
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Report Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-clipboard-text-outline' : 'mdi-pencil'" size="24" class="mr-3"
              color="primary"></v-icon>
            <span class="text-h5 font-weight-bold">{{ formTitle }}</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="close" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <v-form v-model="form" @submit.prevent="save">
            <v-row>
              <!-- Report Details Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-clipboard-text" class="mr-2"></v-icon>
                  Report Details
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <div class="date-picker-container">
                  <label class="v-label">Date & Time</label>
                  <VueDatePicker v-model="editedItem.date_input" :rules="required" placeholder="Select Date & Time"
                    :enable-time-picker="true" :format="formattedDate" class="modern-date-picker" />
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.student_uuid" :items="studentOptions" item-title="displayText"
                  item-value="value" label="Select Student" variant="outlined" prepend-inner-icon="mdi-account-school"
                  :rules="required" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.type_report" :items="typeOptions" item-title="displayText"
                  item-value="value" label="Report Type" variant="outlined" prepend-inner-icon="mdi-clipboard-check"
                  :rules="required" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea v-model="editedItem.note" :rules="required" label="Notes" variant="outlined"
                  prepend-inner-icon="mdi-note-text" :loading="loading" rows="2" clearable></v-textarea>
              </v-col>

              <!-- Quran Progress Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-book-open-variant" class="mr-2"></v-icon>
                  Quran Progress
                </h3>
              </v-col>

              <!-- Start Position -->
              <v-col cols="12">
                <h4 class="text-subtitle-1 mb-3 d-flex align-center">
                  <v-icon icon="mdi-play" class="mr-2" color="success"></v-icon>
                  Start Position
                </h4>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedStartJuz" :items="juzOptions" item-title="displayText" item-value="value"
                  label="Start Juz" variant="outlined" prepend-inner-icon="mdi-book-open-page-variant"
                  @update:model-value="onJuzChange" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedStartPage" :items="pageOptions" item-title="displayText" item-value="value"
                  label="Start Page" variant="outlined" prepend-inner-icon="mdi-bookmark" :disabled="!selectedStartJuz"
                  clearable></v-select>
              </v-col>

              <!-- End Position -->
              <v-col cols="12">
                <h4 class="text-subtitle-1 mb-3 d-flex align-center">
                  <v-icon icon="mdi-stop" class="mr-2" color="error"></v-icon>
                  End Position
                </h4>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedEndJuz" :items="juzOptions" item-title="displayText" item-value="value"
                  label="End Juz" variant="outlined" prepend-inner-icon="mdi-book-open-page-variant"
                  :disabled="!selectedStartPage" @update:model-value="onJuzEndChange" clearable></v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="selectedEndPage" :items="pageOptions" item-title="displayText" item-value="value"
                  label="End Page" variant="outlined" prepend-inner-icon="mdi-bookmark" :disabled="!selectedEndJuz"
                  clearable></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="close">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="elevated" size="large" :disabled="!form" :loading="loading" @click="save">
            {{ editedIndex === -1 ? 'Create Report' : 'Update Report' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500" persistent>
      <v-card class="modern-dialog delete-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-delete-alert" size="24" class="mr-3" color="error"></v-icon>
            <span class="text-h5 font-weight-bold">Confirm Deletion</span>
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
              You're about to delete the report for
              <strong class="text-error">{{ editedItem.student_fullname }}</strong>
              ({{ editedItem.type_report }}). This action cannot be undone.
            </p>

            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">
                  All associated data and progress will be permanently removed.
                </span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" size="large" :loading="loading" @click="deleteItemConfirm">
            Delete Report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Lock Confirmation Dialog -->
    <v-dialog v-model="dialogLock" max-width="500" persistent>
      <v-card class="modern-dialog lock-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-lock-alert" size="24" class="mr-3" color="warning"></v-icon>
            <span class="text-h5 font-weight-bold">Lock Report</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeLock" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-lock-outline" size="64" color="warning" class="mb-4"></v-icon>

            <h3 class="text-h6 mb-3">Lock this report?</h3>

            <p class="text-body-1 mb-4">
              You're about to lock the report for
              <strong>{{ editedItem.student_fullname }}</strong> ({{ editedItem.type_report }}).
            </p>

            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">
                  Once locked, this report will become final and cannot be modified.
                </span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeLock">
            Cancel
          </v-btn>
          <v-btn color="warning" variant="elevated" size="large" :loading="loading" @click="lockItemConfirm">
            Lock Report
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modern Unlock Confirmation Dialog -->
    <v-dialog v-model="dialogUnlock" max-width="500" persistent>
      <v-card class="modern-dialog unlock-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-lock-open-alert" size="24" class="mr-3" color="success"></v-icon>
            <span class="text-h5 font-weight-bold">Unlock Report</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeUnlock" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-lock-open-outline" size="64" color="success" class="mb-4"></v-icon>

            <h3 class="text-h6 mb-3">Unlock this report?</h3>

            <p class="text-body-1 mb-4">
              You're about to unlock the report for
              <strong>{{ editedItem.student_fullname }}</strong> ({{ editedItem.type_report }}).
            </p>

            <v-card variant="tonal" color="info" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">
                  The report will no longer be final and can be modified again.
                </span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeUnlock">
            Cancel
          </v-btn>
          <v-btn color="success" variant="elevated" size="large" :loading="loading" @click="unlockItemConfirm">
            Unlock Report
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

.action-btn {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  letter-spacing: normal;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.search-field {
  border-radius: 12px;
}

.search-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-table-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
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

.lock-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-orange), 0.02) 100%);
}

.unlock-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-teal), 0.02) 100%);
}

.modern-dialog :deep(.v-field) {
  border-radius: 12px;
}

.modern-dialog :deep(.v-btn) {
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

.font-mono {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.date-picker-container {
  position: relative;
}

.date-picker-container .v-label {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 8px;
  display: block;
}

.modern-date-picker {
  width: 100%;
}

.modern-date-picker :deep(.dp__input) {
  border: 1px solid rgba(var(--v-theme-outline), 0.38);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.modern-date-picker :deep(.dp__input:focus) {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.12);
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
  }

  .action-buttons {
    width: 100%;
  }

  .action-btn {
    flex: 1;
  }

  .modern-dialog {
    margin: 16px;
    max-height: calc(100vh - 32px);
  }
}

/* Dark mode adjustments */
.v-theme--dark .data-table-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

.v-theme--dark .modern-date-picker :deep(.dp__input) {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  border-color: rgba(var(--v-theme-outline), 0.38);
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
    pageOptions: [],
    juzOptions: [],
    juzPageOptions: [],
    studentOptions: [],
    selectedStartJuz: null,
    selectedStartPage: null,
    selectedEndJuz: null,
    selectedEndPage: null,
    typeOptions: [],
    dialog: false,
    dialogDelete: false,
    dialogLock: false,
    dialogUnlock: false,
    headers: [],
    breadcrumbsItems: [
      {
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Report Management',
        disabled: true,
        href: 'report',
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
      date_input: null,
      name: '',
      description: '',
      type_report: '',
      note: '',
      is_locked: '',
      locked_at: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_nis: '',
      student_firstname: '',
      student_lastname: '',
      student_fullname: '',
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
      date_input: null,
      name: '',
      description: '',
      type_report: '',
      note: '',
      is_locked: '',
      locked_at: '',
      created_at: '',
      updated_at: '',
      deleted_at: '',
      student_nis: '',
      student_firstname: '',
      student_lastname: '',
      student_fullname: '',
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
    isTeacherRole: false,
    orgOptions: [],
    gradeOptions: [],
    teacherOptions: [],
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
      return this.editedIndex === -1 ? 'Create New Report' : 'Edit Report'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.reports.filter(report =>
        Object.values(report).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
    formattedDate() {
      if (!this.editedItem.date_input) return ''
      const date = new Date(this.editedItem.date_input)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hh = String(date.getHours()).padStart(2, '0')
      const mm = String(date.getMinutes()).padStart(2, '0')
      const ss = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day} ${hh}:${mm}:${ss}`
    }
  },

  watch: {
    async dialog(val) {
      if (val) {
        this.orgOptions = await this.fetchOrganizationOptions()
        this.gradeOptions = await this.fetchGradeOptions()
        this.teacherOptions = await this.fetchTeacherOptions()
        this.juzOptions = await this.fetchJuzOptions()
        this.pageOptions = await this.fetchPageOptions()
        this.studentOptions = await this.fetchKelasStudentOptions()
        this.typeOptions = await this.fetchReportTypeOptions()
      } else {
        this.close()
      }
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

    getAvatarColor(name) {
      const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];
      const index = name ? name.charCodeAt(0) % colors.length : 0;
      return colors[index];
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    onJuzChange() {
      this.selectedStartPage = null;
    },

    onJuzEndChange() {
      this.selectedEndPage = null;
    },

    detailReport(slug) {
      this.$router.push({ path: `/report/${slug}` });
    },

    async fetchData() {
      this.loading = true;
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)
      const { isSuperAdmin, isSuperAdminOrAdmin, isTeacher } = userStorage
      const { page, itemsPerPage } = this.options;
      const params = {
        page,
        limit: itemsPerPage,
        q: this.search,
        sortOrder: '1',
        sortField: 'is_locked',
      };

      this.isSuperAdminRole = isSuperAdmin(activeRole.value)
      this.isSuperAdminOrAdminRole = isSuperAdminOrAdmin(activeRole.value)
      this.isTeacherRole = isTeacher(activeRole.value)

      if (activeRole.value.constant_value === 2) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid
        }
      }

      if (activeRole.value.constant_value === 3) {
        params.filter = {
          org_uuid: activeRole.value.org_uuid,
          teacher_uuid: activeRole.value.teacher_uuid,
        }
      }

      this.activeRole = activeRole.value
      this.headers = this.getHeaders(activeRole.value.constant_value)

      if (this.search !== "") {
        params.q = this.search;
      }

      const reportStorage = useReportStorage()
      const data = await reportStorage.getReports(params)

      this.reports = data.data
      this.totalItems = Number(data.total)
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
            width: '120px'
          },
          {
            title: 'Date',
            key: 'date_input',
            width: '150px'
          },
          {
            title: 'Student',
            key: 'student_fullname',
            width: '200px'
          },
          {
            title: 'Type',
            key: 'type_report',
            width: '120px'
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
            width: '120px'
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
            width: '120px'
          },
          {
            title: 'Total',
            key: 'total',
            width: '80px'
          },
          {
            title: 'Organization',
            key: 'org_uuid',
            width: '150px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '120px',
            align: 'center'
          },
        ]
        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'student_nis',
            width: '120px'
          },
          {
            title: 'Date',
            key: 'date_input',
            width: '150px'
          },
          {
            title: 'Student',
            key: 'student_fullname',
            width: '200px'
          },
          {
            title: 'Type',
            key: 'type_report',
            width: '120px'
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
            width: '120px'
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
            width: '120px'
          },
          {
            title: 'Total',
            key: 'total',
            width: '80px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '120px',
            align: 'center'
          },
        ]
        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const teacherHeader = [
          {
            title: 'NIS',
            align: 'start',
            key: 'student_nis',
            width: '120px'
          },
          {
            title: 'Date',
            key: 'date_input',
            width: '150px'
          },
          {
            title: 'Student',
            key: 'student_fullname',
            width: '200px'
          },
          {
            title: 'Type',
            key: 'type_report',
            width: '120px'
          },
          {
            title: 'Start Page',
            key: 'start_juz_page_name',
            width: '120px'
          },
          {
            title: 'End Page',
            key: 'end_juz_page_name',
            width: '120px'
          },
          {
            title: 'Total',
            key: 'total',
            width: '80px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '120px',
            align: 'center'
          },
        ]
        headers = headers.concat(teacherHeader)
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
          displayText: 'Ziyadah',
        },
        {
          value: 'murojaah',
          displayText: 'Murojaah',
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
      this.loading = true
      const reportStorage = useReportStorage()
      const respDelete = await reportStorage.removeReport(this.editedItem)

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

    async lockItemConfirm() {
      this.loading = true
      const reportStorage = useReportStorage()
      const respLock = await reportStorage.lockReport(this.editedItem)

      this.alertMessage = respLock.message
      this.hasAlert = true
      this.alertType = respLock.status

      if (respLock.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogLock = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeLock()
        }, 700)
      }
      this.loading = false
    },

    async unlockItemConfirm() {
      this.loading = true
      const reportStorage = useReportStorage()
      const respUnlock = await reportStorage.unlockReport(this.editedItem)

      this.alertMessage = respUnlock.message
      this.hasAlert = true
      this.alertType = respUnlock.status

      if (respUnlock.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogUnlock = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeUnlock()
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
      this.selectedStartJuz = null
      this.selectedStartPage = null
      this.selectedEndJuz = null
      this.selectedEndPage = null
    },

    closeDelete() {
      this.dialogDelete = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeLock() {
      this.dialogLock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeUnlock() {
      this.dialogUnlock = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      const userStorage = useUserStorage()
      const { me, activeRole } = storeToRefs(userStorage)

      this.loading = true

      if ([2, 3].includes(activeRole.value.constant_value)) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        const reportStorage = useReportStorage()
        const respEdited = await reportStorage.editReport(this.editedItem)

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
          }, 700)
        }
      } else {
        const kelasData = me.value.kelas
        const reportStorage = useReportStorage()

        this.editedItem.teacher_uuid = kelasData.teacher_uuid
        this.editedItem.start_juz_uuid = this.selectedStartJuz
        this.editedItem.start_page_uuid = this.selectedStartPage
        this.editedItem.end_juz_uuid = this.selectedEndJuz
        this.editedItem.end_page_uuid = this.selectedEndPage
        this.editedItem.kelas_uuid = me.value.kelas.uuid

        const respEdited = await reportStorage.addReport(this.editedItem)

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
      }

      this.loading = false
    },
  },

  async mounted() {
    // Initial data loading will be handled by fetchData method
  }
}
</script>