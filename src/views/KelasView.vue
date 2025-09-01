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
                <v-icon icon="mdi-google-classroom" class="mr-3" color="primary"></v-icon>
                Class Management
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                Manage class schedules, assignments, and student activities
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons d-flex flex-column flex-sm-row ga-3">
              <v-btn v-if="isSuperAdminOrAdminRole" color="primary" variant="elevated" size="large"
                @click="dialog = true" class="action-btn" prepend-icon="mdi-plus">
                <span class="d-none d-sm-inline">New Class</span>
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
        <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search classes..." variant="outlined"
          clearable hide-details class="search-field" density="comfortable"></v-text-field>
      </v-col>
      <v-col cols="12" md="4" lg="6" class="d-flex justify-end align-center">
        <v-chip v-if="kelases.length > 0" color="primary" variant="tonal" prepend-icon="mdi-google-classroom">
          {{ totalItems }} Total Classes
        </v-chip>
      </v-col>
    </v-row>

    <!-- Data Table Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="data-table-card" elevation="4">
          <v-data-table :headers="headers" :search="search" :items="kelases" :items-length="totalItems"
            :loading="loading" v-model:options="options" @update:options="fetchData"
            :sort-by="[{ key: 'name', order: 'asc' }]" class="modern-table" :mobile-breakpoint="600">

            <!-- Class Name with Icon -->
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <v-avatar :color="getStatusColor(item.status)" size="32" class="mr-3">
                  <v-icon :icon="getStatusIcon(item.status)" color="white" size="16"></v-icon>
                </v-avatar>
                <div>
                  <div class="font-weight-medium">{{ item.name }}</div>
                  <div class="text-caption text-medium-emphasis d-md-none">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Description -->
            <template v-slot:item.description="{ item }">
              <div>
                <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span class="text-truncate" style="max-width: 200px;">{{ item.description }}</span>
              </div>
            </template>

            <!-- Period with Icon -->
            <template v-slot:item.period="{ item }">
              <div>
                <v-icon icon="mdi-calendar-range" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                <span>{{ item.period || 'Not Set' }}</span>
              </div>
            </template>

            <!-- Status with Chip -->
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" :variant="item.status === 'active' ? 'elevated' : 'tonal'"
                size="small" :prepend-icon="getStatusIcon(item.status)" class="font-weight-medium">
                {{ formatStatus(item.status) }}
              </v-chip>
            </template>

            <!-- Organization -->
            <template v-slot:item.org_name="{ item }">
              <div>
                <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                {{ item.org_name }}
              </div>
            </template>

            <!-- Teacher Info -->
            <template v-slot:item.teacher_firstname="{ item }">
              <div v-if="item.teacher_firstname">
                <v-avatar color="secondary" size="24" class="mr-2">
                  <span class="text-white text-caption font-weight-bold">
                    {{ getInitials(item.teacher_firstname) }} {{ getInitials(item.teacher_lastname) }}
                  </span>
                </v-avatar>
                {{ item.teacher_firstname }} {{ item.teacher_lastname }}
              </div>
              <span v-else class="text-medium-emphasis">Not Assigned</span>
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
              <div class="action-buttons-cell justify-center">
                <!-- Start Class -->
                <v-tooltip text="Start Class" location="top"
                  v-if="item.status === 'not_started' && isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-play" size="small" variant="text" color="success" @click="startItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <!-- Reactivate Class -->
                <v-tooltip text="Reactivate Class" location="top"
                  v-if="item.status === 'finished' && isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-replay" size="small" variant="text" color="info" @click="reactivateItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <!-- End Class -->
                <v-tooltip text="End Class" location="top" v-if="item.status === 'active' && isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-stop" size="small" variant="text" color="warning" @click="endItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <!-- View Details -->
                <v-tooltip text="View Details" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-eye" size="small" variant="text" color="primary" @click="detailKelas(item.uuid)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <!-- Edit Class -->
                <v-tooltip text="Edit Class" location="top" v-if="isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-pencil" size="small" variant="text" color="primary" @click="editItem(item)"
                      v-bind="props"></v-btn>
                  </template>
                </v-tooltip>

                <!-- Delete Class -->
                <v-tooltip text="Delete Class" location="top"
                  v-if="item.status === 'not_started' && isSuperAdminOrAdminRole">
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="deleteItem(item)"
                      v-bind="props"></v-btn>
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
                <v-icon icon="mdi-google-classroom" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Classes Found</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  {{ search ? 'No classes match your search criteria.' : 'Get started by creating your first class.' }}
                </p>
                <v-btn v-if="!search && isSuperAdminOrAdminRole" color="primary" variant="elevated"
                  @click="dialog = true" prepend-icon="mdi-plus">
                  Create First Class
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modern Class Dialog -->
    <v-dialog v-model="dialog" max-width="900" persistent>
      <v-card class="modern-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon :icon="editedIndex === -1 ? 'mdi-google-classroom' : 'mdi-pencil'" size="24" class="mr-3"
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
              <!-- Class Information Section -->
              <v-col cols="12">
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-information" class="mr-2"></v-icon>
                  Class Information
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.name" :rules="required" label="Class Name" variant="outlined"
                  prepend-inner-icon="mdi-google-classroom" :loading="loading" clearable></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.total_juz_target" :rules="required" label="Total Juz Target"
                  type="number" variant="outlined" prepend-inner-icon="mdi-target" :loading="loading"
                  clearable></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea v-model="editedItem.description" :rules="required" label="Description" variant="outlined"
                  prepend-inner-icon="mdi-text" :loading="loading" rows="3" clearable></v-textarea>
              </v-col>

              <!-- Assignment Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <h3 class="text-h6 mb-4 d-flex align-center">
                  <v-icon icon="mdi-account-group" class="mr-2"></v-icon>
                  Assignment & Organization
                </h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.teacher_uuid" :items="teacherOptions" item-title="displayText"
                  item-value="value" label="Assign Teacher" variant="outlined" prepend-inner-icon="mdi-account-tie"
                  clearable>
                  <template v-slot:selection="{ item }">
                    <div class="d-flex align-center">
                      <v-avatar color="secondary" size="24" class="mr-2">
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
                        <v-avatar color="secondary" size="32">
                          <span class="text-white font-weight-bold">
                            {{ getInitials(item.title) }}
                          </span>
                        </v-avatar>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-select v-model="editedItem.grade_uuid" :items="gradeOptions" item-title="displayText"
                  item-value="value" label="Select Grade" variant="outlined" prepend-inner-icon="mdi-school"
                  clearable></v-select>
              </v-col>

              <v-col cols="12" md="6" v-if="isSuperAdminRole">
                <v-select v-model="editedItem.org_uuid" :items="orgOptions" item-title="displayText" item-value="value"
                  label="Organization" variant="outlined" prepend-inner-icon="mdi-domain"></v-select>
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
            {{ editedIndex === -1 ? 'Create Class' : 'Update Class' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
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
              You're about to delete class <strong class="text-error">{{ editedItem.name }}</strong>.
              This action cannot be undone.
            </p>
            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">All associated data and student records will be permanently removed.</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeDelete">Cancel</v-btn>
          <v-btn color="error" variant="elevated" size="large" :loading="loading" @click="deleteItemConfirm">
            Delete Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Start Class Dialog -->
    <v-dialog v-model="dialogStart" max-width="500" persistent>
      <v-card class="modern-dialog start-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-play-circle" size="24" class="mr-3" color="success"></v-icon>
            <span class="text-h5 font-weight-bold">Start Class</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeStart" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-play-circle-outline" size="64" color="success" class="mb-4"></v-icon>
            <h3 class="text-h6 mb-3">Ready to Start?</h3>
            <p class="text-body-1 mb-4">
              You're about to start class <strong class="text-success">{{ editedItem.name }}</strong>.
              Students will be able to participate in class activities.
            </p>
            <v-card variant="tonal" color="success" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">Starting this class will enable all class activities and features.</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeStart">Cancel</v-btn>
          <v-btn color="success" variant="elevated" size="large" :loading="loading" @click="startItemConfirm">
            Start Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- End Class Dialog -->
    <v-dialog v-model="dialogEnd" max-width="500" persistent>
      <v-card class="modern-dialog end-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-stop-circle" size="24" class="mr-3" color="warning"></v-icon>
            <span class="text-h5 font-weight-bold">End Class</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeEnd" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-stop-circle-outline" size="64" color="warning" class="mb-4"></v-icon>
            <h3 class="text-h6 mb-3">End This Class?</h3>
            <p class="text-body-1 mb-4">
              You're about to end class <strong class="text-warning">{{ editedItem.name }}</strong>.
              Students will no longer be able to participate in class activities.
            </p>
            <v-card variant="tonal" color="warning" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">You can reactivate this class later if needed.</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeEnd">Cancel</v-btn>
          <v-btn color="warning" variant="elevated" size="large" :loading="loading" @click="endItemConfirm">
            End Class
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Reactivate Class Dialog -->
    <v-dialog v-model="dialogReactivate" max-width="500" persistent>
      <v-card class="modern-dialog reactivate-dialog">
        <v-card-title class="dialog-header pa-6">
          <div class="d-flex align-center">
            <v-icon icon="mdi-replay" size="24" class="mr-3" color="info"></v-icon>
            <span class="text-h5 font-weight-bold">Reactivate Class</span>
            <v-btn icon="mdi-close" variant="text" size="small" @click="closeReactivate" class="ml-auto"></v-btn>
          </div>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <v-alert v-if="hasAlert" :type="alertType" :text="alertMessage" variant="tonal" closable
            class="mb-4"></v-alert>

          <div class="text-center">
            <v-icon icon="mdi-replay" size="64" color="info" class="mb-4"></v-icon>
            <h3 class="text-h6 mb-3">Reactivate Class?</h3>
            <p class="text-body-1 mb-4">
              You're about to reactivate class <strong class="text-info">{{ editedItem.name }}</strong>.
              Students will be able to participate in class activities again.
            </p>
            <v-card variant="tonal" color="info" class="pa-4 mb-4">
              <div class="d-flex align-center">
                <v-icon icon="mdi-information" class="mr-2"></v-icon>
                <span class="text-body-2">Reactivating will restore all class activities and features.</span>
              </div>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" size="large" @click="closeReactivate">Cancel</v-btn>
          <v-btn color="info" variant="elevated" size="large" :loading="loading" @click="reactivateItemConfirm">
            Reactivate Class
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

.start-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-info), 0.02) 100%);
}

.end-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-error), 0.02) 100%);
}

.reactivate-dialog .dialog-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-success), 0.02) 100%);
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
        title: 'Dashboard',
        disabled: false,
        href: '/dashboard',
      },
      {
        title: 'Class Management',
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
      teacher_uuid: '',
      teacher_firstname: '',
      teacher_lastname: '',
      teacher_email: '',
      grade_uuid: '',
      status: 'not_started',
    },
    defaultItem: {
      uuid: '',
      name: '',
      description: '',
      org_uuid: '',
      org_name: '',
      period: '',
      total_juz_target: null,
      teacher_uuid: '',
      teacher_firstname: '',
      teacher_lastname: '',
      teacher_email: '',
      grade_uuid: '',
      status: 'not_started',
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
      return this.editedIndex === -1 ? 'Create New Class' : 'Edit Class'
    },
    validForm() {
      return this.$refs.form?.$valid;
    },
    filteredItems() {
      return this.kelases.filter(kelas =>
        Object.values(kelas).some(val =>
          val?.toString().toLowerCase().includes(this.search.toLowerCase())
        )
      );
    },
  },

  watch: {
    async dialog(val) {
      if (val) {
        this.orgOptions = await this.fetchOrganizationOptions()
        this.gradeOptions = await this.fetchGradeOptions()
        this.teacherOptions = await this.fetchTeacherOptions()
      } else {
        this.close()
      }
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
        q: this.search,
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
      this.totalItems = data.total
      this.loading = false
    },

    getHeaders(activeRole) {
      let headers = [];
      if (activeRole === 1) {
        const superAdminHeader = [
          {
            title: 'Class',
            align: 'start',
            key: 'name',
            width: '200px'
          },
          {
            title: 'Description',
            key: 'description',
            width: '200px'
          },
          {
            title: 'Period',
            key: 'period',
            width: '120px'
          },
          {
            title: 'Status',
            key: 'status',
            width: '120px'
          },
          {
            title: 'Teacher',
            key: 'teacher_firstname',
            width: '160px'
          },
          {
            title: 'Email',
            key: 'teacher_email',
            width: '160px'
          },
          {
            title: 'Organization',
            key: 'org_name',
            width: '160px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '200px',
            align: 'center'
          },
        ]
        headers = headers.concat(superAdminHeader)
      }

      if (activeRole === 2) {
        const adminHeader = [
          {
            title: 'Class',
            align: 'start',
            key: 'name',
            width: '200px'
          },
          {
            title: 'Description',
            key: 'description',
            width: '200px'
          },
          {
            title: 'Period',
            key: 'period',
            width: '120px'
          },
          {
            title: 'Status',
            key: 'status',
            width: '120px'
          },
          {
            title: 'Teacher',
            key: 'teacher_firstname',
            width: '160px'
          },
          {
            title: 'Email',
            key: 'teacher_email',
            width: '160px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '200px',
            align: 'center'
          },
        ]
        headers = headers.concat(adminHeader)
      }

      if (activeRole === 3) {
        const teacherHeader = [
          {
            title: 'Class',
            align: 'start',
            key: 'name',
            width: '200px'
          },
          {
            title: 'Description',
            key: 'description',
            width: '200px'
          },
          {
            title: 'Period',
            key: 'period',
            width: '120px'
          },
          {
            title: 'Status',
            key: 'status',
            width: '120px'
          },
          {
            title: 'Actions',
            key: 'actions',
            sortable: false,
            width: '100px',
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

      const teacherOptionsData = await teacherStorage.getTeachers(params);
      const teacherOptions = teacherOptionsData.data.map(teacher => {
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
      const gradeOptions = gradeOptionsData.data.map(grade => {
        return {
          ...grade,
          value: grade.uuid,
          displayText: grade.name,
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
      this.loading = true
      const kelasStorage = useKelasStorage()
      const respDelete = await kelasStorage.removeKelas(this.editedItem)

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

    async startItemConfirm() {
      this.loading = true
      const kelasStorage = useKelasStorage()
      const respStart = await kelasStorage.startKelas(this.editedItem)

      this.alertMessage = respStart.message
      this.hasAlert = true
      this.alertType = respStart.status

      if (respStart.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogStart = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeStart()
        }, 700)
      }
      this.loading = false
    },

    async endItemConfirm() {
      this.loading = true
      const kelasStorage = useKelasStorage()
      const respEnd = await kelasStorage.endKelas(this.editedItem)

      this.alertMessage = respEnd.message
      this.hasAlert = true
      this.alertType = respEnd.status

      if (respEnd.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogEnd = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeEnd()
        }, 700)
      }
      this.loading = false
    },

    async reactivateItemConfirm() {
      this.loading = true
      const kelasStorage = useKelasStorage()
      const respReactivate = await kelasStorage.reactivateKelas(this.editedItem)

      this.alertMessage = respReactivate.message
      this.hasAlert = true
      this.alertType = respReactivate.status

      if (respReactivate.status == "success") {
        this.fetchData()
        setTimeout(() => {
          this.dialogReactivate = false
          this.alertMessage = ''
          this.hasAlert = false
          this.alertType = ''
          this.editedIndex = -1
          this.editedItem = Object.assign({}, this.defaultItem)
          this.closeReactivate()
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

    closeStart() {
      this.dialogStart = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeEnd() {
      this.dialogEnd = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    closeReactivate() {
      this.dialogReactivate = false
      this.alertMessage = ''
      this.hasAlert = false
      this.alertType = ''
      this.editedIndex = -1
      this.editedItem = Object.assign({}, this.defaultItem)
    },

    async save() {
      const userStorage = useUserStorage()
      const { activeRole } = storeToRefs(userStorage)

      this.loading = true

      if (activeRole.value.constant_value === 2) {
        this.editedItem.org_uuid = activeRole.value.org_uuid;
      }

      if (this.editedIndex > -1) {
        const kelasStorage = useKelasStorage()
        const respEdited = await kelasStorage.editKelas(this.editedItem)

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
        const kelasStorage = useKelasStorage()
        const respEdited = await kelasStorage.addKelas(this.editedItem)

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