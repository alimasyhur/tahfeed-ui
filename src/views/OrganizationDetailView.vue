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
                <!-- Organization Logo Avatar -->
                <div class="org-avatar-section d-inline-flex align-center mr-4">
                  <v-avatar size="64" class="org-avatar">
                    <v-img v-if="organization?.logo_image_url" :src="organization.logo_image_url"
                      :alt="organization?.name || 'Organization'" cover></v-img>
                    <v-icon v-else icon="mdi-domain" size="48" color="primary"></v-icon>
                  </v-avatar>
                </div>
                {{ organization?.name || 'Organization Details' }}
              </h1>
              <p class="page-subtitle text-body-1 text-medium-emphasis">
                View organization information, verification status, and member details
              </p>
            </div>

            <div class="action-buttons" v-if="organization">
              <v-chip color="primary" variant="tonal" prepend-icon="mdi-account-group" class="mr-2">
                {{ users.length }} Member{{ users.length !== 1 ? 's' : '' }}
              </v-chip>
              <v-chip :color="organization.is_verified_label_color" variant="tonal" prepend-icon="mdi-check-circle">
                {{ organization.is_verified_label }}
              </v-chip>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Organization Information Card -->
    <v-row class="mb-6" v-if="organization">
      <v-col cols="12">
        <v-card class="modern-card organization-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-avatar size="40" class="org-icon-avatar mr-4">
                  <v-img v-if="organization?.logo_image_url" :src="organization.logo_image_url"
                    :alt="organization?.name || 'Organization'" cover></v-img>
                  <v-icon v-else icon="mdi-domain" size="24" color="primary"></v-icon>
                </v-avatar>
                <span class="text-h5 font-weight-bold">Organization Information</span>
              </div>

              <div class="status-indicators">
                <v-chip :color="organization.is_active_label_color" variant="tonal" size="small" class="mr-2">
                  {{ organization.is_active_label }}
                </v-chip>
                <v-chip :color="organization.is_verified_label_color" variant="tonal" size="small">
                  {{ organization.is_verified_label }}
                </v-chip>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12" md="6">
                <div class="info-item">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-domain" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="info-label">Organization Name</span>
                  </div>
                  <div class="info-value">{{ organization.name }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="info-item">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-web" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="info-label">Domain</span>
                  </div>
                  <div class="info-value">{{ organization.domain }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="info-item">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-email" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="info-label">Email</span>
                  </div>
                  <div class="info-value">
                    <a :href="`mailto:${organization.email}`" class="text-decoration-none">
                      {{ organization.email }}
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
                    <a :href="`tel:${organization.phone}`" class="text-decoration-none">
                      {{ organization.phone }}
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
                  <div class="info-value">{{ organization.address }}</div>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="info-item">
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-text" size="small" class="mr-2 text-medium-emphasis"></v-icon>
                    <span class="info-label">Biography</span>
                  </div>
                  <div class="info-value">{{ organization.bio || 'No biography provided' }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Organization Members Card -->
    <v-row class="mb-6" v-if="organization">
      <v-col cols="12">
        <v-card class="modern-card members-card" elevation="4">
          <v-card-title class="card-header pa-6">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <v-icon icon="mdi-account-group" size="24" class="mr-3" color="primary"></v-icon>
                <span class="text-h5 font-weight-bold">Organization Members</span>
                <v-chip color="primary" variant="tonal" prepend-icon="mdi-account-group" class="ml-4">
                  {{ users.length }} Member{{ users.length !== 1 ? 's' : '' }}
                </v-chip>
              </div>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-0" v-if="users.length > 0">
            <v-data-table :headers="userHeaders" :items="users" class="modern-table members-table"
              :mobile-breakpoint="600" hide-default-footer :items-per-page="-1">

              <!-- User Name -->
              <template v-slot:item.user_name="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-3">
                    <v-img v-if="item.profile_image_url" :src="item.profile_image_url" :alt="item.user_name"
                      cover></v-img>
                    <v-icon v-else icon="mdi-account-circle" size="20" color="grey"></v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-medium">{{ item.user_name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ item.email }}</div>
                  </div>
                </div>
              </template>

              <!-- Role -->
              <template v-slot:item.role_name="{ item }">
                <v-chip color="secondary" variant="tonal" size="small" prepend-icon="mdi-account-tie">
                  {{ item.role_name }}
                </v-chip>
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

          <!-- Empty State -->
          <v-card-text class="pa-8 text-center" v-else>
            <v-icon icon="mdi-account-group-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-h6 mb-2">No Members Found</h3>
            <p class="text-body-2 text-medium-emphasis">
              This organization doesn't have any members yet.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Organization Not Found State -->
    <v-row v-else class="mb-6">
      <v-col cols="12">
        <v-card class="modern-card" elevation="4">
          <v-card-text class="pa-8 text-center">
            <v-icon icon="mdi-domain-off" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
            <h3 class="text-h4 mb-2">Organization Not Found</h3>
            <p class="text-body-1 text-medium-emphasis mb-4">
              The organization you're looking for doesn't exist or may have been removed.
            </p>
            <v-btn color="primary" variant="elevated" :to="{ name: 'organization' }" prepend-icon="mdi-arrow-left">
              Back to Organizations
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <div v-if="loading" class="text-center pa-8">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="text-h6 mt-4">Loading organization details...</p>
    </div>
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

.org-avatar-section {
  position: relative;
}

.org-avatar {
  border: 3px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.org-icon-avatar {
  border: 2px solid rgba(var(--v-theme-primary), 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.status-indicators {
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* Mobile Responsive Adjustments */
@media (max-width: 600px) {
  .header-section {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem !important;
    flex-direction: column;
    align-items: flex-start;
  }

  .org-avatar-section {
    margin-bottom: 16px;
    margin-right: 0 !important;
  }

  .card-header {
    padding: 16px !important;
  }

  .info-item {
    margin-bottom: 16px;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .status-indicators {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Dark mode adjustments */
.v-theme--dark .modern-card {
  background: rgba(var(--v-theme-surface), 0.95);
}

.v-theme--dark .header-section {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

/* Card specific styling */
.organization-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-info), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.members-card .card-header {
  background: linear-gradient(135deg, rgba(var(--v-theme-success), 0.05) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

/* Hover effects */
.modern-card {
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Member avatar styling */
.members-table :deep(.v-avatar) {
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
}
</style>

<script>
import { useOrganizationStorage } from '@/stores/organizationStorage';
import { useUserOrganizationStorage } from '@/stores/userOrganizationStorage';

export default {
  data: () => ({
    slug: null,
    loading: false,
    breadcrumbsItems: [
      {
        title: 'Organizations',
        disabled: false,
        to: { name: 'organization' }
      },
    ],
    organization: null,
    users: [],
    userHeaders: [
      {
        title: 'Member',
        align: 'start',
        key: 'user_name',
        width: '300px'
      },
      {
        title: 'Role',
        key: 'role_name',
        width: '150px'
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
    ]
  }),
  methods: {
    getBreadcrumbs() {
      this.breadcrumbsItems = [
        {
          title: 'Organizations',
          disabled: false,
          to: { name: 'organization' }
        },
        {
          title: this.slug,
          disabled: true,
          href: `organization/${this.slug}`,
        }
      ]
    },
    async loadOrganizationData() {
      this.loading = true
      try {
        const orgStorage = useOrganizationStorage()
        const data = await orgStorage.showOrganizationByDomain(this.slug)
        this.organization = data.data

        if (this.organization) {
          const params = {}
          params.filter = { org_uuid: this.organization.uuid };

          const userOrgStorage = useUserOrganizationStorage()
          const userOrgData = await userOrgStorage.getUserOrganizations(params)
          this.users = userOrgData.data
        }
      } catch (error) {
        console.error('Error loading organization data:', error)
        this.organization = null
        this.users = []
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    this.slug = this.$route.params.slug;
    this.getBreadcrumbs()
    await this.loadOrganizationData()
  }
};
</script>
