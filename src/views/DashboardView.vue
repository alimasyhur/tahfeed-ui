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
                <v-icon icon="mdi-view-dashboard" class="mr-3" color="primary"></v-icon>
                Dashboard
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                My Organization Activities
              </p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <div v-if="me">
      <!-- Profile Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card profile-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-account" size="24" class="mr-3" color="primary"></v-icon>
                  <span class="text-h5 font-weight-bold">Profile Information</span>
                </div>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-6">
              <div v-if="me.profile !== null">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-account" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Name</span>
                      </div>
                      <div class="info-value">{{ me.user.name }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Email</span>
                      </div>
                      <div class="info-value">{{ me.user.email }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-account-details" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Full Name</span>
                      </div>
                      <div class="info-value">{{ me.profile.firstname }} {{ me.profile.lastname }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-calendar" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Birthdate</span>
                      </div>
                      <div class="info-value">{{ formatDate(me.profile.birthdate) }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Phone</span>
                      </div>
                      <div class="info-value">
                        <a :href="`tel:${me.profile.phone}`" class="text-decoration-none">
                          {{ me.profile.phone }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Biography</span>
                      </div>
                      <div class="info-value">{{ me.profile.bio || 'No biography provided' }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <div v-else class="text-center pa-8">
                <v-icon icon="mdi-account-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">Profile Not Complete</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Complete your profile to get the most out of your account.
                </p>
                <v-btn color="primary" variant="elevated" @click="openCreateProfile()" prepend-icon="mdi-plus">
                  Create Profile
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Organization Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card organization-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center justify-space-between w-100">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-domain" size="24" class="mr-3" color="primary"></v-icon>
                  <span class="text-h5 font-weight-bold">Organization</span>
                </div>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-6">
              <div v-if="me.organization !== null">
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Organization Name</span>
                      </div>
                      <div class="info-value">{{ me.organization.name }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-web" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Domain</span>
                      </div>
                      <div class="info-value">{{ me.organization.domain }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Email</span>
                      </div>
                      <div class="info-value">
                        <a :href="`mailto:${me.organization.email}`" class="text-decoration-none">
                          {{ me.organization.email }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-phone" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Phone</span>
                      </div>
                      <div class="info-value">
                        <a :href="`tel:${me.organization.phone}`" class="text-decoration-none">
                          {{ me.organization.phone }}
                        </a>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-map-marker" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Address</span>
                      </div>
                      <div class="info-value">{{ me.organization.address }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Description</span>
                      </div>
                      <div class="info-value">{{ me.organization.bio || 'No description provided' }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-check-circle" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Verification Status</span>
                      </div>
                      <v-chip :color="me.organization.is_verified_label_color" variant="tonal" size="small">
                        {{ me.organization.is_verified_label }}
                      </v-chip>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-item">
                      <div class="d-flex align-center mb-3">
                        <v-icon icon="mdi-toggle-switch" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                        <span class="info-label">Active Status</span>
                      </div>
                      <v-chip :color="me.organization.is_active_label_color" variant="tonal" size="small">
                        {{ me.organization.is_active_label }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <div v-else class="text-center pa-8">
                <v-icon icon="mdi-domain" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                <h3 class="text-h6 mb-2">No Organization</h3>
                <p class="text-body-2 text-medium-emphasis mb-4">
                  Create your organization to get started with managing your institution.
                </p>
                <v-btn v-if="isSuperAdminOrAdmin()" color="primary" variant="elevated" @click="openCreateOrganization()"
                  prepend-icon="mdi-plus">
                  Create Organization
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Roles Information Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card roles-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center">
                <v-icon icon="mdi-account-group" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h5 font-weight-bold">My Roles</span>
                <v-chip color="primary" variant="tonal" prepend-icon="mdi-account-group" class="ml-4">
                  {{ me.roles.length }} Role{{ me.roles.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0">
              <v-data-table :headers="roleHeaders" :items="me.roles" class="modern-table roles-table"
                :mobile-breakpoint="600" hide-default-footer>
                <!-- Role Name -->
                <template v-slot:item.role_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-account-tie" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="font-weight-medium">{{ item.role_name }}</span>
                  </div>
                </template>

                <!-- Organization -->
                <template v-slot:item.org_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    {{ item.org_name }}
                  </div>
                </template>

                <!-- Active Status -->
                <template v-slot:item.is_active_label="{ item }">
                  <v-chip :color="item.is_active_label_color" variant="tonal" size="small">
                    {{ item.is_active_label }}
                  </v-chip>
                </template>

                <!-- Confirmation Status -->
                <template v-slot:item.is_confirmed_label="{ item }">
                  <v-chip :color="item.is_confirmed_label_color" variant="tonal" size="small">
                    {{ item.is_confirmed_label }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Qur'an Templates Card -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="modern-card quran-card" elevation="4">
            <v-card-title class="card-header pa-6">
              <div class="d-flex align-center">
                <v-icon icon="mdi-book-open-page-variant" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h5 font-weight-bold">My Qur'an Templates</span>
                <v-chip color="primary" variant="tonal" prepend-icon="mdi-book-open-page-variant" class="ml-4">
                  {{ me.qurans.length }} Template{{ me.qurans.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0">
              <v-data-table :headers="quranHeaders" :items="me.qurans" class="modern-table quran-table"
                :mobile-breakpoint="600" hide-default-footer>
                <!-- Template Name -->
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-book" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="font-weight-medium">{{ item.name }}</span>
                  </div>
                </template>

                <!-- Description -->
                <template v-slot:item.description="{ item }">
                  <span class="text-body-2">{{ item.description || 'No description' }}</span>
                </template>

                <!-- Organization -->
                <template v-slot:item.organization_name="{ item }">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    {{ item.organization_name }}
                  </div>
                </template>

                <!-- No Data State -->
                <template v-slot:no-data>
                  <div class="text-center pa-8">
                    <v-icon icon="mdi-book-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
                    <h3 class="text-h6 mb-2">No Templates Found</h3>
                    <p class="text-body-2 text-medium-emphasis">
                      You haven't created any Qur'an templates yet.
                    </p>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Profile Dialog -->
    <v-dialog v-model="dialogProfile" width="auto" min-width="500" persistent>
      <ProfileInput :profile="profile" />
    </v-dialog>

    <!-- Organization Dialog -->
    <v-dialog v-model="dialogOrganization" width="auto" min-width="500" persistent>
      <OrganizationInput :organization="organization" />
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

.modern-card {
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  margin-bottom: 24px;
}

.card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.02) 100%);
  border-bottom: 1px solid rgba(var(--v-theme-outline), 0.12);
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

.info-item {
  margin-bottom: 24px;
}

.info-label {
  font-weight: 600;
  color: grey;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  font-size: 1rem;
  line-height: 1.5;
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

  .card-header {
    padding: 16px !important;
  }

  .info-item {
    margin-bottom: 16px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .modern-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

/* Profile specific styling */
.profile-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.organization-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.roles-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-warning), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.quran-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}
</style>

<script setup>
import ProfileInput from "@/components/forms/ProfileInput.vue"
import OrganizationInput from "@/components/forms/OrganizationInput.vue"
import { useUserStorage } from '@/stores/userStorage';
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue';

const userStorage = useUserStorage()
const { me, dialogProfile } = storeToRefs(userStorage)
const { isSuperAdminOrAdmin } = userStorage

const organizationStorage = useOrganizationStorage()
const { dialogOrganization } = storeToRefs(organizationStorage)

// Breadcrumbs
const breadcrumbsItems = [
  {
    title: 'Dashboard',
    disabled: false,
    href: '/dashboard',
  }
];

// Table headers
const roleHeaders = [
  {
    title: 'Role',
    align: 'start',
    key: 'role_name',
    width: '200px'
  },
  {
    title: 'Organization',
    key: 'org_name',
    width: '200px'
  },
  {
    title: 'Active Status',
    key: 'is_active_label',
    width: '150px'
  },
  {
    title: 'Confirmation Status',
    key: 'is_confirmed_label',
    width: '150px'
  },
];

const quranHeaders = [
  {
    title: 'Template Name',
    align: 'start',
    key: 'name',
    width: '200px'
  },
  {
    title: 'Description',
    key: 'description',
    width: '300px'
  },
  {
    title: 'Organization',
    key: 'organization_name',
    width: '200px'
  },
];

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openEditProfile = (profileData) => {
  dialogProfile.value = true
  profile.value = profileData
}

const openCreateProfile = () => {
  dialogProfile.value = true
}

const openEditOrganization = (organizationData) => {
  dialogOrganization.value = true
  organization.value = organizationData
}

const openCreateOrganization = () => {
  dialogOrganization.value = true
}

const profile = ref({
  uuid: null,
  firstname: null,
  lastname: null,
  birthdate: null,
  phone: null,
  bio: null,
})

const organization = ref({
  uuid: null,
  name: null,
  domain: null,
  bio: null,
  address: null,
  email: null,
  phone: null,
})

if (me != null) {
  profile.value = me.profile
  organization.value = me.organization
}

onMounted(() => {
  userStorage.dataUser()
})
</script>